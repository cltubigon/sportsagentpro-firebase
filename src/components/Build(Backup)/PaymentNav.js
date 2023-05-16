import { SearchIcon } from "@chakra-ui/icons"
import { Text, Flex, Box, CloseButton, Icon, Input, InputGroup, InputLeftElement } from "@chakra-ui/react"

const PaymentNav = () => {
  const navContainerStyle = {
    justifyContent: "space-between",
    flexGrow: 1,
    py: 5,
    px: 20,
    borderBottom: "2px solid #EBEFF2",
  }
  const subMenuContainer = {
    justifyContent: "space-between",
    flexGrow: 1,
    pt: 5,
    pb: 2,
    px: 20,
    flexDirection: 'column',
  }
  return (
    <>
      <Flex sx={navContainerStyle}>
        <Box>
          <Text fontSize={"xl"} fontWeight={"semibold"}>
            Payment
          </Text>
          <Text fontSize={"sm"} color={"gray.500"}>
          Select your payment method and agree to Opendorse terms
          </Text>
        </Box>

        <Flex alignItems={"center"}>
          <Icon as={CloseButton} />
        </Flex>
      </Flex>
      <Flex sx={subMenuContainer}>
        <InputGroup >
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input placeholder="Search recipients..." border={'1px solid #89949F'} borderRadius={'50px'} />
        </InputGroup>
      </Flex>
    </>
  )
}

export default PaymentNav