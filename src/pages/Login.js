import { useForm } from "react-hook-form"
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Text,
  Box,
  Heading,
  Flex,
  Stack,
  useToast,
  InputGroup,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react"
import { useDispatch, useSelector } from "react-redux"
import { setAuthError, signIn } from "../store/actions/authActions"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Footer from "../components/layouts/Footer"

const LoginForm = () => {
  console.log("login rendered")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast()

  const authError = useSelector((state) => state.auth.authError)
  const firebase = useSelector((state) => state.firebase)

  const [loading, setLoading] = useState(false)

  const [displayError, setDisplayError] = useState(null)
  const { register, handleSubmit, formState } = useForm()
  const { errors } = formState

  const onSubmit = (data) => {
    setLoading(() => true)
    dispatch(signIn(data))
  }

  useEffect(() => {
    if (authError) {
      if (authError === "auth/user-not-found") {
        setDisplayError("User not found")
      } else {
        setDisplayError("Incorrect username or password")
      }
    }
  }, [authError])

  useEffect(() => {
    if (authError) {
      toast({
        title: "Login error",
        description: displayError,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      })
    }

    return () => {
      dispatch(setAuthError())
      setDisplayError(null)
    }
  }, [displayError])

  useEffect(() => {
    if (firebase.profile.userType) {
      setLoading(() => false)
      const userType = firebase.profile.userType
      switch (userType) {
        case "brand":
          navigate("/network")
          break
        case "athlete":
          navigate("/athlete-home")
          break
        default:
          break
      }
    }
  }, [firebase.profile])

  const [show, setShow] = useState(false)
  const showPassword = () => setShow(!show)

  const containerStyle = {
    maxW: "500px",
    p: 6,
    my: 10,
    border: "1px solid #B8BFC5",
    borderRadius: "8px",
    boxShadow: "md",
    mx: "auto",
  }

  const formControlStyle = {
    mb: 5,
  }

  const formLabelStyle = {
    fontSize: "sm",
    fontWeight: "normal",
  }
  return (
    <>
      <Box justifyContent={"center"} textAlign={"center"} pt={"50px"}>
        <Heading>
          <Link to={"/"}>Sports Agent Pro</Link>
        </Heading>
      </Box>

      <Stack sx={containerStyle} gap={4}>
        <Text fontSize={"3xl"} fontWeight={"semibold"} textAlign={"center"}>
          User sign in
        </Text>
        {loading && (
          <Flex justifyContent={"center"}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="lg"
            />
          </Flex>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormControl sx={formControlStyle} isInvalid={errors.email}>
            <FormLabel sx={formLabelStyle} htmlFor="email">
              Email
            </FormLabel>
            <Input
              type="email"
              id="email"
              placeholder="email"
              {...register("email", {
                required: "Enter your email address",
                pattern: {
                  value: /^[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+$/i,
                  message: "Please enter a valid email",
                },
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl sx={formControlStyle} isInvalid={errors.password}>
            <FormLabel sx={formLabelStyle} htmlFor="password">
              Password
            </FormLabel>
            <InputGroup>
              <Input
                type={show ? "text" : "password"}
                id="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={showPassword}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <Button mt={4} colorScheme="twitter" type="submit" w={"full"}>
            Login
          </Button>

          <Flex alignItems={"center"} mt={5} justifyContent={"center"} gap={4}>
            <Text>Dont have an account?</Text>
            <Link to={"/signup"}>
              <Button colorScheme="gray" border={"1px solid #ccc"}>
                Signup
              </Button>
            </Link>
          </Flex>
        </form>
      </Stack>
      <Footer />
    </>
  )
}

export default LoginForm
