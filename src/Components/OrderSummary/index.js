import { Fragment } from "react"
import { useOrderDetails } from "../../Context/OrderContext"
import { SummaryForm } from "../SummaryForm"

export const OrderSummary = ({setOrderPhase}) => {
  const [orderDetails] = useOrderDetails()

  const scoopArray = Array.from(orderDetails.scoops.entries())
  const scoopList = scoopArray.map(([key, value]) => (
    <li key={key}>
      {value} {key}
    </li>
  ))

  const hasToppings = orderDetails.toppings.size > 0
  let toppingsDiplay = null

  if (hasToppings) {
    const toppingsArray = Array.from(orderDetails.toppings.keys())
    const toppingList = toppingsArray.map(key => <li key={key}>{key}</li>)

    toppingsDiplay = (
      <Fragment>
        <h2>Toppings: {orderDetails.totals.toppings}</h2>
        <ul>{toppingList}</ul>
      </Fragment>
    )
  }

  return (
    <div>
      <h1>Order Summary</h1>
      <h2>Scoops: {orderDetails.totals.scoops}</h2>
      <ul>{scoopList}</ul>
      {toppingsDiplay}
      <SummaryForm setOrderPhase={setOrderPhase} />
    </div>
  )
}
