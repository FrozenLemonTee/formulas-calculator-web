///|
fn json_escape(text : String) -> String {
  let chars : Array[Char] = []
  text
  .iter()
  .each(fn(c) {
    match c {
      '"' => {
        chars.push('\\')
        chars.push('"')
      }
      '\\' => {
        chars.push('\\')
        chars.push('\\')
      }
      '\n' => {
        chars.push('\\')
        chars.push('n')
      }
      '\r' => {
        chars.push('\\')
        chars.push('r')
      }
      '\t' => {
        chars.push('\\')
        chars.push('t')
      }
      _ => chars.push(c)
    }
  })
  String::from_array(chars)
}

///|
fn result_json(result : @fc.CommandResult) -> String {
  match result {
    Ok(text) => "{\"ok\":true,\"value\":\"\{json_escape(text)}\"}"
    Err(text) => "{\"ok\":false,\"error\":\"\{json_escape(text)}\"}"
  }
}

///|
fn parse_bindings(text : String) -> Array[@fc.InputBinding] {
  let bindings : Array[@fc.InputBinding] = []
  let mut name = ""
  let mut value = ""
  let mut reading_value = false
  text
  .iter()
  .each(fn(c) {
    match c {
      '\n' => {
        if name != "" {
          bindings.push(@fc.InputBinding::new(name, value))
        }
        name = ""
        value = ""
        reading_value = false
      }
      '=' =>
        if reading_value {
          value = value + "\{c}"
        } else {
          reading_value = true
        }
      _ =>
        if reading_value {
          value = value + "\{c}"
        } else {
          name = name + "\{c}"
        }
    }
  })
  if name != "" {
    bindings.push(@fc.InputBinding::new(name, value))
  }
  bindings
}

///|
pub fn list_json() -> String {
  result_json(@fc.run_list())
}

///|
pub fn show_json(name : String) -> String {
  result_json(@fc.run_show(name))
}

///|
pub fn calc_json(name : String, bindings : String, format : String) -> String {
  result_json(@fc.run_calc(name, parse_bindings(bindings), format~))
}
