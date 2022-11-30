import productApi from '@/api/productApi'
import { Box, MenuItem, Stack, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

function FilterTable({ chooseProvider, chooseCategory, chooseIsExisted }) {
    const [provider, setProvider] = useState(-1)
    const [category, setCategory] = useState(-1)
    const [isExisted, setIsExisted] = useState(0)
    const [providerList, setProviderList] = useState([])
    const [categoryList, setCategoryList] = useState([])

    const getAllCategory = async () => {
        try {
            const response = await productApi.getAllCategory()
            setCategoryList(response.data)
        } catch (error) {
            console.log('fail when getAllCategory', error)
        }
    }

    const getAllProvider = async () => {
        try {
            const response = await productApi.getAllProvider()
            setProviderList(response.data)
        } catch (error) {
            console.log('fail when getAllCategory', error)
        }
    }

    useEffect(() => {
        getAllCategory()
        getAllProvider()
    }, [])

    return (
        <>
            <Stack spacing={2} direction="row">
                <TextField
                    id="outlined-select-currency"
                    select
                    size="small"
                    label="Nhà cung cấp"
                    value={provider}
                    onChange={(event) => {
                        setProvider(event.target.value)
                        chooseProvider(event.target.value)
                    }}
                    sx={{ width: 200 }}>
                    <MenuItem value={-1}>Tất cả</MenuItem>
                    {providerList.map((provider) => {
                        return (
                            <MenuItem key={provider.id} value={provider.id}>
                                {provider.name}
                            </MenuItem>
                        )
                    })}
                </TextField>
                <TextField
                    id="outlined-select-currency"
                    select
                    size="small"
                    label="Danh mục"
                    value={category}
                    onChange={(event) => {
                        setCategory(event.target.value)
                        chooseCategory(event.target.value)
                    }}
                    sx={{ width: 200 }}>
                    <MenuItem value={-1}>Tất cả</MenuItem>
                    {categoryList.map((category) => {
                        return (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        )
                    })}
                </TextField>
                <TextField
                    id="outlined-select-currency"
                    select
                    size="small"
                    label="Tình trạng"
                    value={isExisted}
                    sx={{ width: 200 }}
                    onChange={(event) => {
                        setIsExisted(event.target.value)
                        chooseIsExisted(event.target.value)
                    }}>
                    <MenuItem value={0}>Tất cả</MenuItem>
                    <MenuItem value={-1}>Còn hàng</MenuItem>
                    <MenuItem value={1}>Hết hàng</MenuItem>
                </TextField>
            </Stack>
        </>
    )
}

export default FilterTable
