import React, { useState } from 'react'
import QueryBox from './querybox'
import ResponseBox from './responsebox'

const ParentComponent = () => {
  const [data, setData] = useState(null) // Ensure you define this state variable

  return (
    <div>
      <QueryBox setData={setData} /> // Pass the setData function as a prop
      <ResponseBox data={data} />
    </div>
  )
}

export default ParentComponent
