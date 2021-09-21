import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { pricePerItem } from '../../constant'
import { formartCurrency } from '../../utils'

const OrderContext = createContext()

// create customm hook to check whether we're inside a provider

export const useOrderDetails = () => {
  const context = useContext(OrderContext)

  if (!context) {
    throw new Error(
      'useOrderDetails must be used within a OrderContextProvider'
    )
  }

  return context
}

const calculateSubtotal = (optionType, optionCounts) => {
  let optionCount = 0
  for (const count of optionCounts[optionType].values()) {
    optionCount += count
  }

  return optionCount * pricePerItem[optionType]
}

export const OrderContextProvider = props => {
  const [optionCounts, setOptionCounts] = useState({
    scoops: new Map(),
    toppings: new Map()
  })

  const zeroCurrency = formartCurrency(0)

  const [totals, setTotals] = useState({
    scoops: zeroCurrency,
    toppings: zeroCurrency,
    grandTotal: zeroCurrency
  })

  useEffect(() => {
    const scoopsSubtotal = calculateSubtotal('scoops', optionCounts)
    const toppingsSubtotal = calculateSubtotal('toppings', optionCounts)
    const grandTotal = scoopsSubtotal + toppingsSubtotal

    setTotals({
      scoops: formartCurrency(scoopsSubtotal),
      toppings: formartCurrency(toppingsSubtotal),
      grandTotal: formartCurrency(grandTotal)
    })
  }, [optionCounts])

  const value = useMemo(() => {
    // getter: Object containing option counts for scoops and toppings, subtotal
    const updateItemCount = (itemName, newItemCount, optionType) => {
      const newOptionCounts = { ...optionCounts }

      // update option count for this item with the new value
      const optionCountsMap = optionCounts[optionType]
      optionCountsMap.set(itemName, parseInt(newItemCount))

      setOptionCounts(newOptionCounts)
    }

    const resetOrder = () => {
      setOptionCounts({
        scoops: new Map(),
        toppings: new Map()
      })
    }

    // setter: updateOptionCount
    return [{ ...optionCounts, totals }, updateItemCount, resetOrder]
  }, [optionCounts, totals])

  return <OrderContext.Provider value={value} {...props} />
}
