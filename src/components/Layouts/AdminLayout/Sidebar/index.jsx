import useAuth from '@/hooks/useAuth'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import {
    Avatar,
    Box,
    Collapse,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper
} from '@mui/material'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ConfirmModal from '../../../Common/Modal/ConfirmModal'

function Sidebar() {
    const user = JSON.parse(localStorage.getItem('fbm-user')) || []
    let navigate = useNavigate()
    const { auth, setAuth } = useAuth()
    console.log(auth)
    console.log(user)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false)
    const [open, setOpen] = useState(false)
    const handleListItemClick = (event, index) => {
        setSelectedIndex(index)
    }
    const handleClick = () => {
        setOpen(!open)
    }
    const location = useLocation()
    const items = [
        { name: 'Danh mục', href: '/admin', path: '/admin', allow: ['MANAGER'] },
        { name: 'Sản phẩm', href: '/admin/products', path: '/products', allow: ['MANAGER'] },
        {
            name: 'Hóa đơn',
            href: '/admin/receipts',
            path: '/receipts',
            allow: ['MANAGER', 'SELLER']
        },
        { name: 'Chấm công', href: '/admin/timekeeping', path: '/timekeeping', allow: ['MANAGER'] },
        { name: 'Bảng lương', href: '/admin/payrolls', path: '/payrolls', allow: ['MANAGER'] },
        { name: 'Đơn hàng', href: '/admin/orders', path: '/orders', allow: ['MANAGER', 'SELLER'] },
        {
            name: 'Thông Tin Khách Hàng',
            href: '/admin/dataCustomer',
            path: '/dataCustomer',
            allow: ['MANAGER', 'SELLER']
        },
        {
            name: 'Quản lý phụ cấp',
            href: '/admin/manager/allowance',
            path: '/allowance',
            allow: ['MANAGER']
        },
        {
            name: 'Quản lý thưởng',
            href: '/admin/manager/bonus',
            path: '/bonus',
            allow: ['MANAGER']
        },
        { name: 'Nhân Viên', href: '/admin/contracts', path: '/contracts', allow: ['MANAGER'] },
        {
            name: 'Thống kê',
            href: '/admin/statisticals',
            path: '/statisticals',
            allow: ['MANAGER']
        },
        { name: 'Nhà cung cấp', href: '/admin/suppliers', path: '/suppliers', allow: ['MANAGER'] }
    ]
    return (
        <Box sx={{ position: 'sticky', top: '0px' }}>
            <ConfirmModal
                title="Đăng xuất"
                content="Bạn muốn đăng xuất?"
                isOpen={isOpenConfirmDialog}
                handleClose={() => setIsOpenConfirmDialog(false)}
                handleConfirm={() => {
                    localStorage.removeItem('fbm-user')
                    navigate('/')
                    setAuth(null)
                }}
            />
            <Box>
                <Paper elevation={2} sx={{ overflow: 'auto', height: '96vh' }}>
                    <List
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                        <Box>
                            <Box>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>T</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        sx={{
                                            '& .MuiListItemText-secondary': { fontSize: '0.7rem' },
                                            '& .MuiTypography-root': { fontWeight: '500' }
                                        }}
                                        primary={user.username}
                                        secondary={user.name}
                                    />
                                </ListItem>
                            </Box>
                            <Box sx={{ overflow: 'auto' }}>
                                <Divider />
                                {items.map((item, index) => (
                                    <ListItem
                                        key={index}
                                        sx={{
                                            p: 0,
                                            ...(item.allow.find((i) => i.includes(auth.roles))
                                                ? null
                                                : { display: 'none' })
                                        }}
                                        selected={new RegExp(item.path).test(
                                            location.pathname.slice(6) || location.pathname
                                        )}>
                                        <ListItemButton
                                            sx={{ py: 2 }}
                                            component={Link}
                                            to={item.href}>
                                            <ListItemText
                                                sx={{
                                                    '& .MuiTypography-root': {
                                                        fontWeight: '500'
                                                    }
                                                }}>
                                                {item.name}
                                            </ListItemText>
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </Box>
                        </Box>
                        <Box>
                            <Divider />
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => setIsOpenConfirmDialog(true)}>
                                    <ListItemIcon>
                                        <LogoutRoundedIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        sx={{ '& .MuiTypography-root': { fontWeight: '500' } }}>
                                        Đăng xuất
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                        </Box>
                    </List>
                </Paper>
            </Box>
        </Box>
    )
}

export default Sidebar
