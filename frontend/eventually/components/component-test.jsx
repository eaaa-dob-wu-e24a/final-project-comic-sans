import Input from "./ui/input";
import Checkbox from "./ui/checkbox";
import Button from "./ui/button";

export default function ComponentTest() {
  return (
    <section className="max-w-lg">
      <Input id="test"></Input>
      <Checkbox></Checkbox>
      <Button>test</Button>
    </section>
  );
}
