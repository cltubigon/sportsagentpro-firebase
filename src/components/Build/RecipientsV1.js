import { SearchIcon } from "@chakra-ui/icons"
import {
  Avatar,
  Grid,
  GridItem,
  AvatarBadge,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  Icon,
  InputGroup,
  Text,
  InputLeftElement,
  Input,
  Spinner,
  filter,
} from "@chakra-ui/react"
import { useDispatch, useSelector } from "react-redux"
import { BsChevronLeft, BsChevronRight } from "react-icons/bs"
import { TfiClose, TfiMenuAlt } from "react-icons/tfi"
import { RxDashboard } from "react-icons/rx"
import React, { useEffect, useState } from "react"
import {
  setActiveStep,
  setCheckboxTrueOrFalse,
  setInitialFilteredAthletes,
  setRecipientsListLayout,
} from "../../store/actions/buildPostActions"
import { saveAthletesToStorage } from "../../store/actions/athleteActions"
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md"
import { firestoreConnect } from "react-redux-firebase"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import BuildMenu from "./BuildMenu"
import { SkeletonBuildRecipientsTab, SkeletonBuildRecipientsTabColumn } from "../Skeleton/SkeletonBuildRecipientsTab"

const RecipientsV1 = () => {
  const dispatch = useDispatch()
  const reduxState = useSelector((state) => state)
  const localAthletes = useSelector((state) => state.athlete.athletes)
  const build = useSelector((state) => state.build)
  const { recipients, recipientsListLayout } = build
  const firestoreAthletes = useSelector(
    (state) => state.firestore.ordered.athlete
  )

  const getSelectedRecpients =
    recipients && recipients.filter((data) => data.isChecked)
  const count = getSelectedRecpients && getSelectedRecpients.length

  const { register, watch } = useForm()

  const [tab, setTab] = useState(true)

  const handleListTrue = () => {
    dispatch(setRecipientsListLayout(true))
  }
  const handleListFalse = () => {
    dispatch(setRecipientsListLayout(false))
  }

  const handleItemClick = (id) => {
    dispatch(setCheckboxTrueOrFalse(id))
  }

  const watched = watch("searchQuery")
  const filteredRecipients =
    watched && watched !== ""
      ? recipients &&
        recipients.filter((athlete) => {
          const fullName = `${athlete.firstName} ${athlete.lastName} ${athlete.firstName} `
          return (
            fullName.toLowerCase().includes(watched) ||
            fullName.toLowerCase().includes(watched.toLowerCase())
          )
        })
      : recipients

  useEffect(() => {
    if (
      (!recipients && localAthletes) ||
      (recipients &&
        localAthletes &&
        recipients.length !== localAthletes.length)
    ) {
      dispatch(setInitialFilteredAthletes(localAthletes))
    }
  }, [localAthletes])

  useEffect(() => {
    if (
      (firestoreAthletes &&
        localAthletes &&
        firestoreAthletes.length !== localAthletes.length) ||
      (firestoreAthletes && localAthletes === null)
    ) {
      dispatch(saveAthletesToStorage(firestoreAthletes))
    }
  }, [firestoreAthletes])
  console.log("firestoreAthletes: ", firestoreAthletes)

  const [hasSelectedRecipient, setHasSelectedRecipient] = useState(false)
  useEffect(()=> {
    const hasChecked = recipients && recipients.some(athlete => athlete.isChecked === true)
    hasChecked && setHasSelectedRecipient(true)
  }, [recipients])

  const recipientContainer = {
    alignItems: "center",
    gap: 3,
    px: 4,
    py: 2,
    borderRadius: "5px",
    border: "1px solid transparent",
    _hover: { border: "1px solid #EBEFF2" },
    width: !recipientsListLayout && "234px",
    flexDirection: !recipientsListLayout && "column",
    cursor: "pointer",
    border: !recipientsListLayout
      ? "1px solid #EBEFF2"
      : "1px solid transparent",
  }
  const itemsContainer = {
    display: "flex",
    flexDirection: recipientsListLayout && "column",
    flexWrap: !recipientsListLayout && "wrap",
    gap: !recipientsListLayout && 4,
  }
  const athleteName = {
    fontWeight: "semibold",
    textAlign: !recipientsListLayout && "center",
  }
  const athleteDescription = {
    fontSize: "sm",
    color: "gray.500",
    textAlign: !recipientsListLayout && "center",
  }
  const iconStyle = {
    boxSize: 5,
    mr: !recipientsListLayout && "auto",
  }
  return (
    <>
      <Grid
        templateAreas={`"header"
                            "main"
                            "footer"`}
        gridTemplateRows={"2fr 9fr auto"}
        gridTemplateColumns={"1fr"}
        h="100vh"
      >
        {/* -------------------------------------- Menu section -------------------------------------- */}
        <GridItem area={"header"} pb={4}>
          <BuildMenu />

          <Flex px={20}>
            <Flex
              flexGrow={1}
              gap={8}
              pt={4}
              mb={tab ? 10 : 2}
              borderBottom={"2px solid #EBEFF2"}
            >
              <Text
                onClick={() => setTab(() => true)}
                borderBottom={tab ? "2px solid #000" : "none"}
                pb={2}
                cursor={"pointer"}
              >
                Discover
              </Text>
              <Text
                onClick={() => setTab(() => false)}
                color={count < 1 && "gray.400"}
                borderBottom={tab ? "none" : "2px solid #000"}
                pb={2}
                cursor={"pointer"}
              >
                Selected Recipients {count > 0 && `(${count})`}
              </Text>
            </Flex>
          </Flex>

          {tab && (
            <Flex px={20}>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<SearchIcon color="gray.300" />}
                />
                <Input
                  id="searchQuery"
                  {...register("searchQuery")}
                  placeholder="Search activities..."
                  border={"1px solid #89949F"}
                  borderRadius={"50px"}
                />
              </InputGroup>
            </Flex>
          )}
        </GridItem>

        {/* -------------------------------------- Content section -------------------------------------- */}
        {/* -------------------------------------- First Tab -------------------------------------- */}
        <GridItem
          pl={"80px"}
          pr={"65px"}
          area={"main"}
          overflowY={"auto"}
          position={"relative"}
        >
          <Flex
            bgColor={"#fff"}
            zIndex={"10"}
            pb={4}
            gap={4}
            justifyContent={"flex-end"}
            position={"sticky"}
            top={"0"}
          >
            <Icon
              as={RxDashboard}
              cursor={"pointer"}
              onClick={handleListFalse}
              boxSize={6}
              color={!recipientsListLayout && "blue.400"}
            />
            <Icon
              as={TfiMenuAlt}
              cursor={"pointer"}
              onClick={handleListTrue}
              boxSize={6}
              color={recipientsListLayout && "blue.400"}
            />
          </Flex>

          {tab && (
            <Flex flexBasis={"100%"} flexDirection={"column"} flexGrow={1}>
              <FormControl>
                <InputGroup sx={itemsContainer}>
                {!firestoreAthletes && (!recipientsListLayout ? <SkeletonBuildRecipientsTabColumn /> : <SkeletonBuildRecipientsTab />)}
                  {firestoreAthletes &&
                    firestoreAthletes.map((athlete) => {
                      const thisRecipient =
                        recipients &&
                        recipients.find((data) => data.id === athlete.id)
                      const isChecked = thisRecipient && thisRecipient.isChecked
                      return (
                        <Flex
                          key={athlete.id}
                          sx={recipientContainer}
                          onClick={() => handleItemClick(athlete.id)}
                        >
                          {isChecked ? (
                            <Icon sx={iconStyle} as={MdCheckBox} />
                          ) : (
                            <Icon as={MdCheckBoxOutlineBlank} sx={iconStyle} />
                          )}
                          <Avatar name={athlete.initials}>
                            <AvatarBadge boxSize="0.9em" bg="green.500" />
                          </Avatar>
                          <Box pl={2}>
                            <Text sx={athleteName}>
                              {athlete.firstName} {athlete.lastName}
                            </Text>
                            <Text sx={athleteDescription}>
                              Student-Athlete • Tennis • Fresno State Bulldogs
                            </Text>
                          </Box>
                        </Flex>
                      )
                    })}
                  {/* {filteredRecipients && filteredRecipients.length == 0 && (
                    <Flex>
                      <Text>No data found</Text>
                    </Flex>
                  )} */}
                </InputGroup>
              </FormControl>
            </Flex>
          )}

          {/* -------------------------------------- Second Tab -------------------------------------- */}
          {!tab && (
            <Flex flexBasis={"100%"} flexDirection={"column"} flexGrow={1}>
              {count > 0 ? (
                <FormControl>
                  <InputGroup sx={itemsContainer}>
                    {!firestoreAthletes && (!recipientsListLayout ? <SkeletonBuildRecipientsTabColumn /> : <SkeletonBuildRecipientsTab />)}
                    {firestoreAthletes &&
                      firestoreAthletes.map((athlete) => {
                        const thisRecipient =
                          recipients &&
                          recipients.find((data) => data.id === athlete.id)
                        const isChecked =
                          thisRecipient && thisRecipient.isChecked
                          if (isChecked) {
                            return (
                              <Flex
                              bgColor={'gray.300'}
                                key={athlete.id}
                                sx={recipientContainer}
                                onClick={() => handleItemClick(athlete.id)}
                              >
                                  <Icon as={MdCheckBox} sx={iconStyle} />
                                <Avatar name={athlete.initials}>
                                  <AvatarBadge boxSize="0.9em" bg="green.500" />
                                </Avatar>
                                <Box pl={2}>
                                  <Text sx={athleteName}>
                                    {athlete.firstName} {athlete.lastName}
                                  </Text>
                                  <Text sx={athleteDescription}>
                                    Student-Athlete • Tennis • Fresno State Bulldogs
                                  </Text>
                                </Box>
                              </Flex>
                            )
                          }
                      })}
                    {!hasSelectedRecipient && (
                      <Flex>
                        <Text>No data found</Text>
                      </Flex>
                    )}
                  </InputGroup>
                </FormControl>
              ) : (
                <Flex
                  flexDirection={"column"}
                  height={"40vh"}
                  justifyContent={"center"}
                  alignContent={"center"}
                  gap={4}
                >
                  <Text
                    fontSize={"lg"}
                    fontWeight={"semibold"}
                    textAlign={"center"}
                  >
                    No recipients have been selected
                  </Text>
                  <Button
                    onClick={() => setTab(() => true)}
                    colorScheme="twitter"
                    width={"fit-content"}
                    margin={"0 auto"}
                  >
                    Select Recipients
                  </Button>
                </Flex>
              )}
            </Flex>
          )}
        </GridItem>

        {/* -------------------------------------- Footer Section -------------------------------------- */}
        <GridItem px={20} pt={4} pb={6} area={"footer"}>
          <Flex justifyContent={"space-between"} bottom={"0"}>
            <Button
              leftIcon={<BsChevronLeft />}
              onClick={() => dispatch(setActiveStep("deal_type"))}
            >
              Previous Step
            </Button>
            <Button
              rightIcon={<BsChevronRight />}
              colorScheme="twitter"
              onClick={() => dispatch(setActiveStep("activities"))}
            >
              Next Step
            </Button>
          </Flex>
        </GridItem>
      </Grid>
    </>
  )
}

export default firestoreConnect([
  {
    collection: "athlete",
  },
])(RecipientsV1)
