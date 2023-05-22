import React, { useState } from 'react'
import QueryBox from './querybox'
import ResponseBox from './responsebox'

const ParentComponent = () => {
  const [data, setData] = useState(null)

  return (
    <div>
      <QueryBox setData={setData} />
      <ResponseBox data={data} />
    </div>
  )
}

export default ParentComponent
