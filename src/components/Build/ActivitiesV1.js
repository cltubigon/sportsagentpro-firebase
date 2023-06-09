import { SearchIcon } from "@chakra-ui/icons"
import {
  Text,
  Flex,
  Box,
  SimpleGrid,
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Grid,
  GridItem,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  setActiveStep,
  updateSelectedActivities,
  addOrRemoveActivities,
  setActivityTabStatus,
  setActivitiesListLayout,
} from "../../store/actions/buildPostActions"
import { getTimeToUTCFromLocal } from "../../utils/DateInputToUTCFromLocal"
import { motion } from "framer-motion"
import {
  BsBox,
  BsCamera,
  BsCheckCircleFill,
  BsChevronLeft,
  BsChevronRight,
  BsCurrencyDollar,
  BsExclamationCircleFill,
  BsHeadset,
  BsInstagram,
  BsMic,
  BsPen,
  BsPeople,
  BsSnapchat,
  BsTiktok,
  BsYoutube,
} from "react-icons/bs"
import { TfiClose, TfiMenuAlt } from "react-icons/tfi"
import { RxDashboard } from "react-icons/rx"
import { BsFacebook, BsLinkedin, BsTwitter } from "react-icons/bs"
import { FaIcons } from "react-icons/fa"
import { HiOutlineUserGroup, HiDotsHorizontal } from "react-icons/hi"
import { GoMegaphone } from "react-icons/go"
import { TbLicense } from "react-icons/tb"
import {
  BiUserVoice,
  BiRun,
  BiTrash,
  BiChevronDown,
  BiChevronUp,
} from "react-icons/bi"
import { MdOutlineCoPresent } from "react-icons/md"
import { AiOutlineEye } from "react-icons/ai"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import BuildMenu from "./BuildMenu"

const ActivitiesNav1 = () => {
  const dispatch = useDispatch()
  const reduxPostState = useSelector((state) => state.build)

  const { register, watch } = useForm()
  const watchSearch = watch("searchActivity")

  const { activitiesListLayout, activitiesTabReady, selectedActivities, postContent } = reduxPostState
  const reduxSelectedActivity = selectedActivities

  const [count, setCount] = useState(null)
  const [tab, setTab] = useState(true)
  const [inputs, setInputs] = useState({})

  const handleListTrue = () => {
    dispatch(setActivitiesListLayout(true))
  }
  const handleListFalse = () => {
    dispatch(setActivitiesListLayout(false))
  }

  useEffect(() => {
    const allAmountsAreReady =
      reduxSelectedActivity &&
      !reduxSelectedActivity.some(
        (activity) =>
          activity.activityAmount === "" ||
          activity.activityAmount < 1 ||
          activity.activityAmount === undefined
      )
    const allDatesAreReady =
      reduxSelectedActivity &&
      !reduxSelectedActivity.some(
        (activity) =>
          activity.activityDate === "" || activity.activityDate === undefined
      )
    const activityTabStatus =
      reduxSelectedActivity &&
      reduxSelectedActivity.length > 0 &&
      allAmountsAreReady &&
      allDatesAreReady &&
      allAmountsAreReady === allDatesAreReady
    dispatch(setActivityTabStatus(activityTabStatus))
  }, [reduxSelectedActivity, tab])

  const [activeActivity, setActiveActivity] = useState([])
  const handleActiveActivityClick = (id) => {
    const check =
      activeActivity && !activeActivity.some((data) => data.id === id)
    const filteredActivity = activeActivity.filter((data) => data.id !== id)
    check
      ? setActiveActivity([...activeActivity, { id: id }])
      : setActiveActivity(filteredActivity)
  }

  const activeChecker = (activity) => {
    const isActive = activeActivity.some((data) => data.id === activity.id)
    return isActive
  }

  useEffect(() => {
    if (reduxSelectedActivity && (reduxSelectedActivity.length !== count)) {
      setCount(reduxSelectedActivity.length)
    }

    const selectedActivityIds = reduxSelectedActivity && reduxSelectedActivity.map(
      (activity) => activity.id
    )
    const notSelectedKeys = Object.keys(inputs).filter(
      (keys) =>
        !selectedActivityIds.some(
          (id) => keys === `activityAmount${id}` || keys === `activityDate${id}`
        )
    )
    notSelectedKeys.forEach((key) => {
      if (inputs.hasOwnProperty(key)) {
        if (key.includes("activityDate")) {
          //may try activityAmount too.
          delete inputs[key]
        } else {
          inputs[key] = "0"
        }
      }
    })
  }, [reduxSelectedActivity, count])

  const handleOnChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    })
  }

  useEffect(() => {
    setInputs((prevInputs) => {
      const updatedInputs = { ...prevInputs }

      reduxSelectedActivity.forEach((activity) => {
        if (activity.activityAmount) {
          const amountPropertyName = `activityAmount${activity.id}`
          updatedInputs[amountPropertyName] = activity.activityAmount
        }
        if (activity.activityDate.calendarFormat) {
          const datePropertyName = `activityDate${activity.id}`
          updatedInputs[datePropertyName] = activity.activityDate.calendarFormat
        }
      })
      return updatedInputs
    })
  }, [])

  useEffect(() => {
    const hasNoInput = Object.keys(inputs).length === 0
    !hasNoInput && dispatch(updateSelectedActivities(inputs))
  }, [inputs, tab])

  const postType = useSelector((state) => state.build.postType) // Preious or Next Button
  const [prevButton, setPrevButton] = useState("deal_type")
  useEffect(() => {
    postType === "opportunity"
      ? setPrevButton("deal_type")
      : setPrevButton("recipients")
  }, [postType])

  const isSelected = (id) => {
    const isSelected = reduxSelectedActivity && reduxSelectedActivity.some((data) => data.id === id)
    return isSelected
  }

  const itemsIconStyle = {
    boxSize: 10,
    textAlign: "center",
    mb: !activitiesListLayout && 2,
  }
  const itemDescStyle = {
    fontSize: "xs",
    color: "gray.500",
    textAlign: !activitiesListLayout && "center",
  }
  const itemTitleStyle = {
    fontWeight: "semibold",
    textAlign: !activitiesListLayout && "center",
  }
  const itemContainerStyle = {
    flexDirection: !activitiesListLayout && "column",
    alignContent: "center",
    alignItems: "center",
    px: 3,
    borderRadius: "6px",
    _hover: {
      boxShadow: "md",
    },
    gap: activitiesListLayout && 4,
    width: !activitiesListLayout && "234px",
    cursor: "pointer",
    py: activitiesListLayout ? 5 : 3,
    // bgColor: "blue.100",
  }
  const listContainer = {
    flexDirection: activitiesListLayout && "column",
    flexWrap: !activitiesListLayout && "wrap",
    gap: activitiesListLayout ? 2 : 4,
  }

  const activities = {
    onlineOptionalCategory: [
      {
        id: 1,
        activityTitle: "Twitter Post",
        activityDescription: "One tweet with text or media",
        color: "#1CA1F2",
        icon: BsTwitter,
        isChecked: false,
        value: "twitterPost",
      },
      {
        id: 2,
        activityTitle: "Twitter Video Monetization",
        activityDescription:
          "Videos added to Twitter's video monetization program",
        color: "#1CA1F2",
        icon: BsTwitter,
        isChecked: false,
        value: "twitterVideoMonetization",
      },
      {
        id: 3,
        activityTitle: "Facebook Post",
        activityDescription: "One page post with text or media",
        color: "#1877F2",
        icon: BsFacebook,
        isChecked: false,
        value: "facebookPost",
      },
      {
        id: 4,
        activityTitle: "LinkedIn Post",
        activityDescription: "One timeline post with text or media",
        color: "#0077B7",
        icon: BsLinkedin,
        isChecked: false,
        value: "",
      },
    ],
    onlineCategory: [
      {
        id: 5,
        activityTitle: "Instagram Post",
        activityDescription:
          "One photo, video, or carousel post shared to profile",
        color: "#E4405F",
        icon: BsInstagram,
        isChecked: false,
        value: "instagramPost",
      },
      {
        id: 6,
        activityTitle: "Instagram Story",
        activityDescription:
          "One story that stays live for 24 hours. Specify # of frames",
        color: "#E4405F",
        icon: BsInstagram,
        isChecked: false,
        value: "instagramStory",
      },
      {
        id: 7,
        activityTitle: "Instagram Reels",
        activityDescription: "One original video shared as a Reel",
        color: "#E4405F",
        icon: BsInstagram,
        isChecked: false,
        value: "instagramReels",
      },
      {
        id: 8,
        activityTitle: "Facebook Story",
        activityDescription:
          "One story that stays live for 24 hours on public FB page",
        color: "#1877F2",
        icon: BsFacebook,
        isChecked: false,
        value: "facebookStory",
      },
      {
        id: 9,
        activityTitle: "Facebook Live",
        activityDescription: "One live Facebook broadcast at a dedicated time",
        color: "#1877F2",
        icon: BsFacebook,
        isChecked: false,
        value: "facebookLive",
      },
      {
        id: 10,
        activityTitle: "YouTube Post",
        activityDescription: "One video uploaded to a user's channel",
        color: "#FF0300",
        icon: BsYoutube,
        isChecked: false,
        value: "youtubePost",
      },
      {
        id: 11,
        activityTitle: "TikTok Post",
        activityDescription: "One original video posted to a user's profile",
        color: "gray.700",
        icon: BsTiktok,
        isChecked: false,
        value: "tiktokPost",
      },
      {
        id: 12,
        activityTitle: "Snapchat Story",
        activityDescription: "One Snapchat story",
        color: "#FFFC00",
        icon: BsSnapchat,
        isChecked: false,
        value: "snapchatStory",
      },
      {
        id: 13,
        activityTitle: "Snapchat Spotlight",
        activityDescription: "One Snapchat spotlight",
        color: "#FFFC00",
        icon: BsSnapchat,
        isChecked: false,
        value: "snapchatSpotlight",
      },
      {
        id: 14,
        activityTitle: "Group Licensing",
        activityDescription: "One Snapchat spotlight",
        color: "gray.700",
        icon: HiOutlineUserGroup,
        isChecked: false,
        value: "groupLicensing",
      },
      {
        id: 15,
        activityTitle: "Podcast Appearance",
        activityDescription: "One video or audio podcast appearance",
        color: "gray.700",
        icon: BsMic,
        isChecked: false,
        value: "podcastAppearance",
      },
      {
        id: 16,
        activityTitle: "Digital Press Interview",
        activityDescription: "One online video or audio interview",
        color: "gray.700",
        icon: BsHeadset,
        isChecked: false,
        value: "digitalPressInterview",
      },
      {
        id: 17,
        activityTitle: "Photo / Video / Audio Creation",
        activityDescription:
          "One piece of custom photo, video, or audio content",
        color: "gray.700",
        icon: FaIcons,
        isChecked: false,
        value: "photoVideoAudioCreation",
      },
      {
        id: 18,
        activityTitle: "Video Shoutout",
        activityDescription: "One video sent to the buyer",
        color: "gray.700",
        icon: GoMegaphone,
        isChecked: false,
        value: "videoShoutout",
      },
      {
        id: 19,
        activityTitle: "Other",
        activityDescription: "Pitch any unique offer",
        color: "gray.700",
        icon: HiDotsHorizontal,
        isChecked: false,
        value: "other",
      },
    ],
    offlineCategory: [
      {
        id: 20,
        activityTitle: "Appearance / Meet-and-Greet",
        activityDescription: "One in-person appearance at an event",
        color: "gray.700",
        icon: AiOutlineEye,
        isChecked: false,
        value: "appearanceMeetAndGreet",
      },
      {
        id: 21,
        activityTitle: "Autograph Signing",
        activityDescription: "One autograph signing session",
        color: "gray.700",
        icon: BsPen,
        isChecked: false,
        value: "autographSigning",
      },
      {
        id: 22,
        activityTitle: "Keynote Speech",
        activityDescription: "One speaking engagement at an event",
        color: "gray.700",
        icon: MdOutlineCoPresent,
        isChecked: false,
        value: "keynoteSpeech",
      },
      {
        id: 23,
        activityTitle: "Sport Demonstration",
        activityDescription: "One in-person activity demo, lesson, or clinic",
        color: "gray.700",
        icon: BiRun,
        isChecked: false,
        value: "sportDemonstration",
      },
      {
        id: 24,
        activityTitle: "Production Shoot (Photo / Video)",
        activityDescription: "One in-person photo or video shoot",
        color: "gray.700",
        icon: BsCamera,
        isChecked: false,
        value: "productionShoot",
      },
      {
        id: 25,
        activityTitle: "Product Testing & Feedback",
        activityDescription: "One product testing or feedback session",
        color: "gray.700",
        icon: BsBox,
        isChecked: false,
        value: "productTestingAndFeedback",
      },
      {
        id: 26,
        activityTitle: "In-person Interview",
        activityDescription: "One in-person interview appearance",
        color: "gray.700",
        icon: BiUserVoice,
        isChecked: false,
        value: "inPersonInterview",
      },
      {
        id: 27,
        activityTitle: "Group Marketing",
        activityDescription:
          "Multiple athlete's NIL used for a group marketing activation",
        color: "gray.700",
        icon: BsPeople,
        isChecked: false,
        value: "groupMarketing",
      },
      {
        id: 28,
        activityTitle: "Licensing",
        activityDescription: "Paying for rights to use athlete's NIL",
        color: "gray.700",
        icon: TbLicense,
        isChecked: false,
        value: "licensing",
      },
    ],
  }

  // const onlineOptionalCategory = activities.onlineOptionalCategory
  // const onlineCategory = activities.onlineCategory
  // const offlineCategory = activities.offlineCategory
  // const mergedActivities = [...activities.onlineOptionalCategory, ...activities.onlineCategory, ...activities.offlineCategory]

  const [searchedOptionalCategories, setSearchedOptionalCategories] = useState(
    activities.onlineOptionalCategory
  )
  const [searchedOnlineCategories, setSearchedOnlineCategories] = useState(
    activities.onlineCategory
  )
  const [searchedOfflineCategories, setSearchedOfflineCategories] = useState(
    activities.offlineCategory
  )
  useEffect(() => {
    if (watchSearch && watchSearch.length > 0) {
      setSearchedOptionalCategories(
        activities.onlineOptionalCategory.filter(
          (activity) =>
            watchSearch &&
            activity.activityTitle
              .toLowerCase()
              .includes(watchSearch.toLowerCase())
        )
      )
      setSearchedOnlineCategories(
        activities.onlineCategory.filter(
          (activity) =>
            watchSearch &&
            activity.activityTitle
              .toLowerCase()
              .includes(watchSearch.toLowerCase())
        )
      )
      setSearchedOfflineCategories(
        activities.offlineCategory.filter(
          (activity) =>
            watchSearch &&
            activity.activityTitle
              .toLowerCase()
              .includes(watchSearch.toLowerCase())
        )
      )
    } else {
      setSearchedOptionalCategories(activities.onlineOptionalCategory)
      setSearchedOnlineCategories(activities.onlineCategory)
      setSearchedOfflineCategories(activities.offlineCategory)
    }
  }, [watchSearch])

  const inputBorder = {
    borderColor: "gray.500",
    borderWidth: "1px",
    borderStyle: "solid",
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
                cursor={"pointer"}
                onClick={() => setTab(() => true)}
                borderBottom={tab && "2px solid #000"}
                pb={2}
              >
                Discover
              </Text>
              <Text
                cursor={"pointer"}
                onClick={() => setTab(() => false)}
                borderBottom={!tab && "2px solid #000"}
                pb={2}
              >
                Activity details {count > 0 && `(${count})`}
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
                  placeholder="Search activities..."
                  border={"1px solid #89949F"}
                  borderRadius={"50px"}
                  id="searchActivity"
                  {...register("searchActivity")}
                />
              </InputGroup>
            </Flex>
          )}
        </GridItem>

        {/* -------------------------------------- Content section -------------------------------------- */}
        <GridItem
          pl={"80px"}
          pr={"65px"}
          area={"main"}
          overflowY={"auto"}
          position={"relative"}
        >
          {tab && (
            <Flex
              bgColor={"white"}
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
                color={!activitiesListLayout && "blue.400"}
              />
              <Icon
                as={TfiMenuAlt}
                cursor={"pointer"}
                onClick={handleListTrue}
                boxSize={6}
                color={activitiesListLayout && "blue.400"}
              />
            </Flex>
          )}

          {tab && (
            <Box pb={6}>
              <Flex pb={3}>
                <Text fontWeight={"semibold"}>
                  ONLINE - Optional automated publishing available
                </Text>
              </Flex>
              {searchedOptionalCategories.length > 0 ? (
                <Flex sx={listContainer}>
                  {searchedOptionalCategories.map((activity) => {
                    const {
                      id,
                      icon,
                      color,
                      activityTitle,
                      activityDescription,
                    } = activity
                    return (
                      <Flex
                        key={id}
                        sx={itemContainerStyle}
                        onClick={() =>
                          dispatch(addOrRemoveActivities(activity))
                        }
                        bgColor={isSelected(id) && "blue.100"}
                        border={
                          isSelected(id)
                            ? "1px solid #90CDF4"
                            : "1px solid transparent"
                        }
                        w={"236px"} //Additional, remove this after testing if doesn't work
                        minW={"200px"} //Additional, remove this after testing if doesn't work
                      >
                        <Icon as={icon} color={color} sx={itemsIconStyle} />
                        <Box>
                          <Text sx={itemTitleStyle}>{activityTitle}</Text>
                          <Text sx={itemDescStyle}>{activityDescription}</Text>
                        </Box>
                      </Flex>
                    )
                  })}
                </Flex>
              ) : (
                <Text color={"gray.400"}>No activities found.</Text>
              )}
            </Box>
          )}
          {tab && (
            <Box pb={6}>
              <Flex pb={3}>
                <Text fontWeight={"semibold"}>ONLINE</Text>
              </Flex>
              {searchedOnlineCategories.length > 0 ? (
                <Flex sx={listContainer}>
                  {searchedOnlineCategories.map((activity) => {
                    const {
                      id,
                      icon,
                      color,
                      activityTitle,
                      activityDescription,
                    } = activity
                    return (
                      <Flex
                        key={id}
                        sx={itemContainerStyle}
                        onClick={() =>
                          dispatch(addOrRemoveActivities(activity))
                        }
                        bgColor={isSelected(id) && "blue.100"}
                        border={
                          isSelected(id)
                            ? "1px solid #90CDF4"
                            : "1px solid transparent"
                        }
                      >
                        <Icon as={icon} color={color} sx={itemsIconStyle} />
                        <Box>
                          <Text sx={itemTitleStyle}>{activityTitle}</Text>
                          <Text sx={itemDescStyle}>{activityDescription}</Text>
                        </Box>
                      </Flex>
                    )
                  })}
                </Flex>
              ) : (
                <Text color={"gray.400"}>No activities found.</Text>
              )}
            </Box>
          )}

          {tab && (
            <Box pb={6}>
              <Flex pb={3}>
                <Text fontWeight={"semibold"}>OFFLINE</Text>
              </Flex>
              {searchedOfflineCategories.length > 0 ? (
                <Flex sx={listContainer}>
                  {searchedOfflineCategories.map((activity) => {
                    const {
                      id,
                      icon,
                      color,
                      activityTitle,
                      activityDescription,
                    } = activity
                    return (
                      <Flex
                        key={id}
                        sx={itemContainerStyle}
                        onClick={() =>
                          dispatch(addOrRemoveActivities(activity))
                        }
                        bgColor={isSelected(id) && "blue.100"}
                        border={
                          isSelected(id)
                            ? "1px solid #90CDF4"
                            : "1px solid transparent"
                        }
                      >
                        <Icon as={icon} color={color} sx={itemsIconStyle} />
                        <Box>
                          <Text sx={itemTitleStyle}>{activityTitle}</Text>
                          <Text sx={itemDescStyle}>{activityDescription}</Text>
                        </Box>
                      </Flex>
                    )
                  })}
                </Flex>
              ) : (
                <Text color={"gray.400"}>No activities found.</Text>
              )}
            </Box>
          )}

          {/* -------------------------------------- Tab 2 -------------------------------------- */}
          {!tab && (
            <Flex pb={6} flexDirection={"column"} gap={4}>
              {count ? (
                reduxSelectedActivity.map((activity, index) => {
                  return (
                    <Flex
                      key={index}
                      flexDirection={"column"}
                      borderColor={"gray.300"}
                      borderWidth={"1px"}
                      borderStyle={"solid"}
                      borderRadius={"6px"}
                    >
                      <Flex
                        flexGrow={1}
                        justifyContent={"space-between"}
                        p={2}
                        borderBottom={"1px solid #EBEFF2"}
                      >
                        <Flex alignItems={"flex-start"} gap={2}>
                          <Icon
                            as={
                              activity.activityDate &&
                              activity.activityAmount > 0
                              // activity.activityDate !== "0" &&
                              // activity.activityDate.length > 0 &&
                              // (activity.activityDate ||
                              //   activity.activityDate !== undefined)
                                ? BsCheckCircleFill
                                : BsExclamationCircleFill
                            }
                            color={
                              activity.activityDate &&
                              activity.activityAmount > 0
                              // activity.activityDate !== "0" &&
                              // activity.activityDate.length > 0 &&
                              // (activity.activityDate ||
                              //   activity.activityDate !== undefined)
                                ? "green.500"
                                : "gray.500"
                            }
                            mt={"8px"}
                            boxSize={4}
                          />
                          <Box>
                            <Text fontSize={"xl"} fontWeight={"semibold"}>
                              {activity.activityTitle}
                            </Text>
                            {activity.activityAmount > 0 && (
                              <Text fontSize={"sm"} color={"green.700"}>
                                {`$${parseInt(
                                  activity.activityAmount
                                ).toLocaleString()}.00`}
                              </Text>
                            )}
                          </Box>
                        </Flex>
                        <Flex alignItems={"center"} gap={4}>
                          <Icon
                            as={BiTrash}
                            boxSize={5}
                            color={"blue.400"}
                            cursor={"pointer"}
                            onClick={() =>
                              dispatch(addOrRemoveActivities(activity))
                            }
                          />
                          <motion.div
                            initial={{ rotate: 0 }}
                            animate={{
                              zIndex: 10,
                              rotate: activeChecker(activity) ? 180 : 0,
                              y: activeChecker(activity) ? "-5px" : 0,
                            }}
                            transition={{ duration: 0.2 }}
                            onClick={() =>
                              handleActiveActivityClick(activity.id)
                            }
                          >
                            <Icon as={BiChevronUp} boxSize={6} />
                          </motion.div>
                        </Flex>
                      </Flex>

                      <motion.div
                        animate={{
                          height: activeChecker(activity) ? 0 : "fit-content",
                          opacity: activeChecker(activity) ? 0 : 1,
                        }}
                      >
                        <Flex
                          flexGrow={1}
                          flexDirection={"column"}
                          justifyContent={"space-between"}
                          p={2}
                          borderBottom={"1px solid #EBEFF2"}
                        >
                          <Text color={"gray.400"} fontWeight={"semibold"}>
                            Payment
                          </Text>
                          <Flex>
                            <Text
                              color={"red"}
                              fontWeight={"semibold"}
                              fontSize={"sm"}
                            >
                              *
                            </Text>
                            <Text
                              color={"gray.700"}
                              fontWeight={"semibold"}
                              fontSize={"sm"}
                            >
                              Amount
                            </Text>
                          </Flex>
                          <Text fontSize={"xs"}>
                            Amount to be paid for the activity
                          </Text>
                          <InputGroup my={2}>
                            <InputLeftElement
                              pt={1}
                              pointerEvents="none"
                              color={"gray.800"}
                              children={<BsCurrencyDollar />}
                            />
                            <NumberInput
                              name={`activityAmount${activity.id}`}
                              defaultValue={
                                (activity.activityAmount > 0 &&
                                  activity.activityAmount) ||
                                0
                              }
                              precision={2}
                            >
                              <NumberInputField
                                sx={inputBorder}
                                placeholder="0.00"
                                pl={7}
                                onChange={handleOnChange}
                              />
                            </NumberInput>
                          </InputGroup>
                        </Flex>
                      </motion.div>

                      <motion.div
                        animate={{
                          height: activeChecker(activity) ? 0 : "fit-content",
                          opacity: activeChecker(activity) ? 0 : 1,
                        }}
                      >
                        <Flex
                          flexGrow={1}
                          flexDirection={"column"}
                          justifyContent={"space-between"}
                          p={2}
                          borderBottom={"1px solid #EBEFF2"}
                        >
                          <Text color={"gray.400"} fontWeight={"semibold"}>
                            Due date
                          </Text>
                          <Flex>
                            <Text
                              color={"red"}
                              fontWeight={"semibold"}
                              fontSize={"sm"}
                            >
                              *
                            </Text>
                            <Text
                              color={"gray.700"}
                              fontWeight={"semibold"}
                              fontSize={"sm"}
                            >
                              Date and time
                            </Text>
                          </Flex>
                          <Text fontSize={"xs"}>
                            Date and time activity is to be completed by
                          </Text>
                          <InputGroup>
                            <Input
                              maxW={"300px"}
                              value={activity.activityDate && activity.activityDate.calendarFormat}
                              sx={inputBorder}
                              my={2}
                              placeholder="Select Date and Time"
                              size="md"
                              type="datetime-local"
                              min={getTimeToUTCFromLocal()}
                              name={`activityDate${activity.id}`}
                              onChange={handleOnChange}
                            />
                          </InputGroup>
                        </Flex>
                      </motion.div>

                      <Flex
                        px={2}
                        alignItems={"center"}
                        gap={1}
                        pb={2}
                        color={"blue.400"}
                      >
                        <Icon
                          as={BiTrash}
                          zIndex={10}
                          boxSize={4}
                          onClick={() =>
                            dispatch(addOrRemoveActivities(activity))
                          }
                          cursor={"pointer"}
                        />
                        <Text
                          onClick={() =>
                            dispatch(addOrRemoveActivities(activity))
                          }
                          zIndex={10}
                          cursor={"pointer"}
                        >
                          Remove activity
                        </Text>
                      </Flex>
                    </Flex>
                  )
                })
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
                    No activities have been selected
                  </Text>
                  <Button
                    onClick={() => setTab(() => true)}
                    colorScheme="twitter"
                    width={"fit-content"}
                    margin={"0 auto"}
                  >
                    Select Activities
                  </Button>
                </Flex>
              )}
            </Flex>
          )}
        </GridItem>

        {/* -------------------------------------- Footer Section -------------------------------------- */}
        <GridItem px={20} pt={4} pb={6} area={"footer"}>
          <Flex justifyContent={"space-between"}>
            <Button
              leftIcon={<BsChevronLeft />}
              onClick={() => dispatch(setActiveStep(prevButton))}
            >
              Previous Step
            </Button>
            <Button
              rightIcon={<BsChevronRight />}
              colorScheme={activitiesTabReady ? "twitter" : "gray"}
              onClick={() => dispatch(setActiveStep("details"))}
            >
              {activitiesTabReady ? "Next Step" : "Skip step for now"}
            </Button>
          </Flex>
        </GridItem>
      </Grid>
    </>
  )
}

export default ActivitiesNav1
