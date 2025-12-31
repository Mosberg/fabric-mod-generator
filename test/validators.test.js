// Simple test runner for fabric-mod-generator core logic
import { Validator } from "../utils/validators.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function testValidator() {
  const v = new Validator();
  // ModId
  assert(v.validateModId("valid_mod").valid, "Valid modId should pass");
  assert(!v.validateModId("InvalidMod").valid, "Uppercase modId should fail");
  // ClassName
  assert(v.validateClassName("MyClass").valid, "Valid className should pass");
  assert(
    !v.validateClassName("myClass").valid,
    "Lowercase className should fail"
  );
  // PackageName
  assert(
    v.validatePackageName("com.example").valid,
    "Valid packageName should pass"
  );
  assert(
    !v.validatePackageName("Com.Example").valid,
    "Uppercase packageName should fail"
  );
  // Version
  assert(v.validateVersion("1.2.3").valid, "Valid version should pass");
  assert(!v.validateVersion("1.2").valid, "Short version should fail");
  // Authors
  assert(v.validateAuthors(["Alice"]).valid, "At least one author required");
  assert(!v.validateAuthors([]).valid, "No authors should fail");
  console.log("Validator tests passed");
}

function runAllTests() {
  testValidator();
  // Add more test suites here
}

runAllTests();
