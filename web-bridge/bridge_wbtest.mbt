///|
test "list json exposes formula catalog" {
  let payload = list_json()
  assert_true(payload.contains("\"ok\":true"))
  assert_true(payload.contains("force"))
  assert_true(payload.contains("ohm-voltage"))
}

///|
test "calc json evaluates bindings" {
  assert_eq(
    calc_json("force", "mass=2 kg\nacceleration=3 m/s^2", "ascii"),
    "{\"ok\":true,\"value\":\"6 kg*m/s^2\"}",
  )
}

///|
test "calc json reports errors" {
  let payload = calc_json("force", "mass=2 kg", "ascii")
  assert_true(payload.contains("\"ok\":false"))
  assert_true(payload.contains("missing input"))
}
