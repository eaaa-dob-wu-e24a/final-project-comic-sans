import Button from "./button";
export default function JoinForm(){
    return(<form action=""
        className="max-w-md mx-auto flex flex-col"
        >
          <input
            type="text"
            placeholder="JX6S7YA1"
            maxLength={8}
            className="rounded-full h-14 w-full text-background uppercase font-semibold text-4xl py-2 px-8"
            name="joincode"
            id="joincode"
          />
          <Button className="mt-[-3.125rem] h-11 mb-6 mr-2 place-self-end relative">Join</Button>
        </form>)
}