import { SearchIcon } from "@chakra-ui/icons"
import {
  Grid,
  GridItem,
  Button,
  Flex,
  Icon,
  Text,
  Input,
  Box,
} from "@chakra-ui/react"
import { useDispatch, useSelector } from "react-redux"
import { BsChevronLeft, BsChevronRight, BsPlus } from "react-icons/bs"
import { TfiClose, TfiMenuAlt } from "react-icons/tfi"
import { setActiveStep, setContent, setDetailsTabStatus, setPostContentLength, setPostExpirationDate, setPostTitle } from "../../store/actions/PostActions"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { getTimeToUTCFromLocal } from "../../utils/DateInputToUTCFromLocal"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import RichEditor from '../../utils/RichEditor/RichEditor'

const DetailsV1 = () => {
  const dispatch = useDispatch()
  const { register, watch } = useForm()
  const reduxPosts = useSelector(state => state.post)
  const { postContent, postTitle, postExpirationDate } = reduxPosts
  
  const [availableCharacters, setAvailableCharacters] = useState(2000)
  const [isCompleted, setIsCompleted] = useState(null)
  const [rawDataParsed, setRawDataParsed] = useState(null)
  const [toggleDate, setToggleDate] = useState(false)
  const [rawDataString, setRawDataString] = useState(null)

  const handleToggleClick = () => {
    setToggleDate(() => true)
  }

  useEffect(()=> {
    const watched = watch(['postTitle', 'expirationDate'])
    if (watched[0] !== undefined) dispatch(setPostTitle(watched[0]))
    if (watched[1] !== undefined) dispatch(setPostExpirationDate(watched[1]))
  }, [watch('postTitle'), watch('expirationDate')])

  // CSS styles --------------
  const borderColorWidthStyle = {
    borderColor: "gray.500",
    borderWidth: "1px",
    borderStyle: "solid",
    my: 2,
  }
  const inputLabelDescriptions = {
    fontSize: "xs",
  }
  const inputLabels = {
    fontWeight: "semibold",
  }
  const borderRadius = "6px"
  const height = "200px"
  
  useEffect(()=> {
    // console.log('availableCharacters: ', availableCharacters)
      setIsCompleted(availableCharacters <= 1949 && availableCharacters >= 0 && postTitle ? true : false)
  }, [availableCharacters, reduxPosts])
  // console.log('isCompleted: ', isCompleted)
  
  useEffect(()=> {
    if (availableCharacters !== 2000) {
      // console.log('I am dispatched', isCompleted)
      dispatch(setDetailsTabStatus(isCompleted))
    }
  }, [isCompleted])

  // ------------ RICH TEXT SAVE ------------
  
  useEffect(()=> {
    availableCharacters >= -1 && dispatch(setContent(rawDataString))

    return
  }, [rawDataString])
  // ------------ RICH TEXT GET ------------
  
  useEffect(()=> {
    if (postContent) {
      setRawDataParsed(JSON.parse(postContent))
    }
    
  }, [])
  return (
    <>
      <Grid
        templateAreas={`"header"
                            "main"
                            "footer"`}
        gridTemplateRows={"auto 9fr auto"}
        gridTemplateColumns={"1fr"}
        h="100vh"
      >
        {/* -------------------------------------- Menu section -------------------------------------- */}
        <GridItem area={"header"} pb={4}>
          <Flex
            px={20}
            flexGrow={1}
            alignItems={"center"}
            borderBottom={"2px solid #EBEFF2"}
          >
            <Flex flexGrow={1} flexDirection={"column"} py={4}>
              <Text fontSize={"xl"} fontWeight={"semibold"}>
                Details
              </Text>
              <Text color={"gray.500"} fontSize={"sm"}>
                Add information about your deal that will be shared with
                recipients
              </Text>
            </Flex>
            <Flex>
              <Link to={'/network'}><Icon as={TfiClose} boxSize={4} /></Link>
            </Flex>
          </Flex>
        </GridItem>

        {/* -------------------------------------- Content section -------------------------------------- */}
        <GridItem
          px={"80px"}
          py={2}
          area={"main"}
          overflowY={"auto"}
          position={"relative"}
        >
          
            <Box mb={4}>
              <Flex>
                <Text color={"red"}>*</Text>
                <Text sx={inputLabels}>Offer name</Text>
              </Flex>
              <Text sx={inputLabelDescriptions}>
                Choose something clear and concise, but make it memorable!
              </Text>
              <Input
                sx={borderColorWidthStyle}
                id="postTitle"
                value={postTitle || ''}
                {...register('postTitle')}
                placeholder="Enter offer name"
              />
            </Box>

            <Box mb={4}>
              <Flex>
                <Text color={"red"}>*</Text>
                <Text sx={inputLabels}>Brief</Text>
              </Flex>
              <Text sx={inputLabelDescriptions} mb={3}>
                Provide a brief background of your business, the purpose of your
                campaign, and clear step-by-step instructions for how to
                complete each activity in the deal.
              </Text>
              <RichEditor
                borderColorWidthStyle={borderColorWidthStyle}
                borderRadius={borderRadius}
                height={height}
                setRawDataString={setRawDataString}
                rawDataParsed={rawDataParsed}
                setAvailableCharacters={setAvailableCharacters}
              />
            </Box>
            <Box mb={4}>
              <Flex gap={1}>
                <Text sx={inputLabels}>Expiration date</Text>
                <Text color={"gray.500"} fontStyle={"italic"}>
                  (Optional)
                </Text>
              </Flex>
              <Text sx={inputLabelDescriptions}>
                After this date, the recipient will no longer be able to review
                or accept your deal.
              </Text>
              <Flex alignItems={"center"}>
                {!toggleDate && !postExpirationDate &&
                  (<Button
                    mt={2}
                    w={"300px"}
                    leftIcon={<BsPlus fontSize={"24px"} />}
                    borderColor={"blue.600"}
                    borderStyle={"solid"}
                    borderWidth={"1px"}
                    colorScheme="gray"
                    color={"blue.600"}
                    onClick={handleToggleClick}
                  >
                    Add deal expiration date
                  </Button>)}
                 
                {(toggleDate || postExpirationDate) && (<Input
                  maxW={"300px"}
                  sx={borderColorWidthStyle}
                  placeholder="Select Date and Time"
                  size="md"
                  type="datetime-local"
                  id="expirationDate"
                  defaultValue={postExpirationDate && postExpirationDate}
                  {...register('expirationDate')}
                  min={getTimeToUTCFromLocal()}
                />)}
              </Flex>
            </Box>
        </GridItem>

        {/* -------------------------------------- Footer Section -------------------------------------- */}
        <GridItem px={20} pt={4} pb={6} area={"footer"}>
          <Flex justifyContent={"space-between"} bottom={"0"}>
            <Button
              leftIcon={<BsChevronLeft />}
              onClick={() => dispatch(setActiveStep("activities"))}
            >
              Previous Step
            </Button>
            <Button
              rightIcon={<BsChevronRight />}
              colorScheme={availableCharacters < 0 ? "gray":"twitter"}
              onClick={() => dispatch(setActiveStep("review"))}
            >
              {availableCharacters < 0 ? 'Skip step for now' : 'Next Step'}
            </Button>
          </Flex>
        </GridItem>
      </Grid>
    </>
  )
}

export default DetailsV1
