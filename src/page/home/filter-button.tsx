import * as React from 'react'
import { Filter } from '../../model/models'
import { Button } from '@material-ui/core'
import { FilterModal } from '../modal/filter/filter'
import { useState } from 'react'
import { useFilter } from '../../redux/seletors'

export const FilterButton: React.FunctionComponent = () => {
  const [opened, setOpened] = useState(false)
  const filter = useFilter()

  let label = 'Filter'
  if (filter && filter.usernames.length > 0) {
    label += ` (${filter.usernames.length} users selected)`
  }

  return (
    <div>
      <Button color="inherit" onClick={() => setOpened(true)}>
        {label}
      </Button>
      <FilterModal open={opened} onClose={() => setOpened(false)} />
    </div>
  )
}
