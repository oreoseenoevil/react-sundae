import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import { ScoopOptions } from '../ScoopOptions'
import { ToppingOptions } from '../ToppingOptions'
import { Row } from 'react-bootstrap'
import { AlertBanner } from '../../common/AlertBanner'
import { pricePerItem } from '../../../constant'
import { useOrderDetails } from '../../../Context/OrderContext'
import { formartCurrency } from '../../../utils'

export const Options = ({ optionType }) => {
  const [items, setItems] = useState([])
  const [error, setError] = useState(false)

  const [orderDetails, updateItemCount] = useOrderDetails()

  useEffect(() => {
    axios
      .get(`http://localhost:3030/${optionType}`)
      .then(res => setItems(res.data))
      .catch(err => {
        setError(true)
      })
  }, [optionType])

  if (error) {
    return <AlertBanner />
  }

  const ItemComponent = optionType === 'scoops' ? ScoopOptions : ToppingOptions
  const title = optionType[0].toUpperCase() + optionType.slice(1).toLowerCase()

  const optionItems = items.map(item => (
    <ItemComponent
      key={item.name}
      name={item.name}
      imagePath={item.imagePath}
      updateItemCount={(itemName, newItemCount) =>
        updateItemCount(itemName, newItemCount, optionType)
      }
    />
  ))

  return (
    <Fragment>
      <h2>{title}</h2>
      <p>{formartCurrency(pricePerItem[optionType])} each</p>
      <p>
        {title} total: {orderDetails.totals[optionType]}
      </p>
      <Row>{optionItems}</Row>
    </Fragment>
  )
}
