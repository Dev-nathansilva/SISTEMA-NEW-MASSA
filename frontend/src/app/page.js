import { Button, HStack } from "@chakra-ui/react";

export default function Principal() {
  return (
    <div>
      <p>PÁGINA PRINCIPAL</p>
      <HStack>
        <Button className="px-8" size="2xl" colorPalette="red" variant="solid">
          Click me
        </Button>
        <Button>Click me</Button>
      </HStack>
    </div>
  );
}
