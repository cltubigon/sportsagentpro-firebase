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
import DashboardLeftMenu from "../components/Dashboard/DashboardLeftMenu"
import DashboardMenu from "../components/Dashboard/BrandDashboard/DashboardMenu"
import DashboardContent from "../components/Dashboard/DashboardContent"

const AthleteHomepage = () => {
  const dispatch = useDispatch()
  const reduxState = useSelector(state => state)
  console.log('reduxState: ', reduxState)

  return (
    <>
      <Grid
        templateAreas={`"n m"
                        "n f"`}
        gridTemplateColumns={"155px calc(100% - 155px)"}
        gridTemplateRows={"1fr 11fr"}
        h="100vh"
        pt={'88px'}
      >
        <GridItem area={"n"} bg="gray.200" >
            <DashboardLeftMenu />
        </GridItem>
        <GridItem area={"m"} mx={4}>
            <DashboardMenu />
        </GridItem>
        <GridItem area={"f"} overflow={'auto'} mx={4}>
            <DashboardContent />
        </GridItem>
      </Grid>
    </>
  )
}

export default AthleteHomepage
