import { Text, Flex, SimpleGrid, Box } from '@chakra-ui/layout'
import { DummyImage } from 'react-simple-placeholder-image'
import ProfileSocialMedia from '../Profile/ProfileSocialMedia'
import { useDispatch, useSelector } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { Link, useLocation } from 'react-router-dom'
import { HomeSkeleton } from '../Skeleton/Skeletons'
import { useEffect } from 'react'
import { saveAthletesToStorage } from '../../store/actions/athleteActions'
import { SkeletonDiscover } from '../Skeleton/SkeletonDiscover'

const Athletes = () => {
  console.log("-------------------Athletes")
  const dispatch = useDispatch()
  const location = useLocation()
  const localAthletes = useSelector(state => state.athlete.athletes)
  const firestoreAthletes = useSelector((state)=> state.firestore.ordered.athlete)
  
  const isNetworkPage = location.pathname === '/network'
  // console.log('isNetworkPage: ', isNetworkPage)
  
  // useEffect(()=> {
  //   if (firestoreAthletes && !localAthletes || firestoreAthletes && localAthletes && firestoreAthletes.length !== localAthletes.length) {
  //     console.log('I will dispatch saveAthletesToStorage')
  //     dispatch(saveAthletesToStorage(firestoreAthletes))
  //   }
  // },[firestoreAthletes])

  const cardCOntainer = {
      flexDirection: "column",
      gap: 3,
    }
  const imageContainer = {
    width: "100%",
    bg: "gray.400",
    justifyContent: "center",
    borderRadius: "md",
  }
  const cardAthleteName = {
    fontSize: "xl",
    fontWeight: "semibold",
  }
  const cardSportsType = {
    color: "gray.600",
  }
  const cardSocialMedia = {
    color: "gray.500",
    pb: 5,
  }
  return (
    <>
      {!firestoreAthletes && <HomeSkeleton />}
      {firestoreAthletes && 
        <SimpleGrid minChildWidth={{base: "100%", sm: "290px", md: isNetworkPage ? '250px' : "300px" }} gap={{base: 3, md: 6}} tabIndex={0}>
          {firestoreAthletes.map((athlete)=> {
              return (
                <div key={athlete.id}>
                  <Link to={`/profile/${athlete.id}`}>
                    <Flex sx={cardCOntainer}  >
                        <Flex sx={imageContainer}>
                            <DummyImage bgColor='transparent' width={"330px"} height={240} placeholder='330x170' />
                        </Flex>
                        <Flex flexDirection={"column"} gap={1}>
                            <Text sx={cardAthleteName}>{athlete.firstName} {athlete.lastName}</Text>
                            <Text sx={cardSportsType}>{athlete.sports} • {athlete.team}</Text>
                            <Box sx={cardSocialMedia}><ProfileSocialMedia /></Box>
                        </Flex>
                    </Flex>
                  </Link>
                </div>
              )
            })
          }
        </SimpleGrid>
      }
    </>
  )
}

export default firestoreConnect([{ collection: 'athlete' }])(Athletes);