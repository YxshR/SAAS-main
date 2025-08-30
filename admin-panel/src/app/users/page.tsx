'use client'

import { AdminLayout } from '@/components/layout/admin-layout'
import { 
  UserPlusIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdvancedDataTable, TableColumn, TableUser } from '@/components/users/advanced-data-table'
import { UserProfileModal } from '@/components/users/user-profile-modal'
import { BulkActionsBar } from '@/components/users/bulk-actions-bar'
import { 
  InlineEditName, 
  InlineEditEmail, 
  InlineEditPhone, 
  InlineEditStatus, 
  InlineEditSubscription,
  InlineEditTokens
} from '@/components/users/inline-edit-cell'
import { 
  fadeVariants, 
  slideUpVariants, 
  staggerContainer,
  staggerItem,
  hoverAnimations,
  clickAnimations
} from '@/lib/animations'

export default function UsersPage() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedUser, setSelectedUser] = useState<TableUser | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [loading, setLoading] = useState(false)

  // Mock data - will be replaced with real API calls
  const [users, setUsers] = useState<TableUser[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      status: 'active',
      subscription: 'premium',
      tokensUsed: 45,
      tokensLimit: 100,
      joinedAt: '2024-01-15T00:00:00Z',
      lastActive: '2024-01-25T10:30:00Z',
      totalSummaries: 67,
      totalSpent: 297
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+91 9876543211',
      status: 'active',
      subscription: 'free',
      tokensUsed: 3,
      tokensLimit: 5,
      joinedAt: '2024-01-20T00:00:00Z',
      lastActive: '2024-01-24T15:20:00Z',
      totalSummaries: 8,
      totalSpent: 0
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+91 9876543212',
      status: 'suspended',
      subscription: 'premium',
      tokensUsed: 0,
      tokensLimit: 100,
      joinedAt: '2024-01-10T00:00:00Z',
      lastActive: '2024-01-22T09:45:00Z',
      totalSummaries: 156,
      totalSpent: 495
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+91 9876543213',
      status: 'inactive',
      subscription: 'free',
      tokensUsed: 5,
      tokensLimit: 5,
      joinedAt: '2024-01-05T00:00:00Z',
      lastActive: '2024-01-18T12:15:00Z',
      totalSummaries: 12,
      totalSpent: 0
    },
    {
      id: '5',
      name: 'Alex Chen',
      email: 'alex@example.com',
      phone: '+91 9876543214',
      status: 'active',
      subscription: 'premium',
      tokensUsed: 78,
      tokensLimit: 100,
      joinedAt: '2024-01-08T00:00:00Z',
      lastActive: '2024-01-25T14:22:00Z',
      totalSummaries: 234,
      totalSpent: 1250
    }
  ])

  // Table columns configuration
  const columns: TableColumn[] = [
    {
      key: 'name',
      header: 'User',
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-admin-accent rounded-full flex items-center justify-center text-white text-sm font-medium">
            {row.name.charAt(0)}
          </div>
          <div>
            <InlineEditName
              value={row.name}
              onSave={async (newValue) => {
                return await updateUser(row.id, { name: String(newValue) })
              }}
            />
            <p className="text-sm text-admin-text-secondary">ID: {row.id}</p>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Contact',
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div>
          <InlineEditEmail
            value={row.email}
            onSave={async (newValue) => {
              return await updateUser(row.id, { email: String(newValue) })
            }}
          />
          <InlineEditPhone
            value={row.phone}
            onSave={async (newValue) => {
              return await updateUser(row.id, { phone: String(newValue) })
            }}
            className="mt-1"
          />
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <InlineEditStatus
          value={row.status}
          onSave={async (newValue) => {
            return await updateUser(row.id, { status: String(newValue) as any })
          }}
        />
      )
    },
    {
      key: 'subscription',
      header: 'Subscription',
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div className="space-y-1">
          <InlineEditSubscription
            value={row.subscription}
            onSave={async (newValue) => {
              return await updateUser(row.id, { subscription: String(newValue) as any })
            }}
          />
          {row.subscription === 'premium' && (
            <span className="text-xs text-admin-text-secondary">
              ₹{row.totalSpent} spent
            </span>
          )}
        </div>
      )
    },
    {
      key: 'tokensUsed',
      header: 'Usage',
      sortable: true,
      render: (value, row) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-20">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  (row.tokensUsed / row.tokensLimit) > 0.8 ? 'bg-red-500' :
                  (row.tokensUsed / row.tokensLimit) > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((row.tokensUsed / row.tokensLimit) * 100, 100)}%` }}
              />
            </div>
            <span className="text-xs text-admin-text-secondary whitespace-nowrap">
              {row.tokensUsed}/{row.tokensLimit}
            </span>
          </div>
          <p className="text-xs text-admin-text-secondary">
            {row.totalSummaries} summaries
          </p>
        </div>
      )
    },
    {
      key: 'lastActive',
      header: 'Activity',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="text-sm text-admin-text-primary">
            Joined: {new Date(row.joinedAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-admin-text-secondary">
            Last: {new Date(row.lastActive).toLocaleDateString()}
          </p>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value, row) => (
        <div className="flex items-center space-x-1">
          <motion.button 
            onClick={(e) => {
              e.stopPropagation()
              handleViewUser(row)
            }}
            className="p-1 text-admin-accent hover:text-blue-600 hover:bg-blue-50 rounded"
            title="View Details"
            whileHover={hoverAnimations.subtle}
            whileTap={clickAnimations.tap}
          >
            <PencilIcon className="h-4 w-4" />
          </motion.button>
          <motion.button 
            onClick={(e) => {
              e.stopPropagation()
              handleAdjustTokens(row.id, 10)
            }}
            className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
            title="Add Tokens"
            whileHover={hoverAnimations.subtle}
            whileTap={clickAnimations.tap}
          >
            <PlusIcon className="h-4 w-4" />
          </motion.button>
          <motion.button 
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteUser(row.id)
            }}
            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
            title="Delete User"
            whileHover={hoverAnimations.subtle}
            whileTap={clickAnimations.tap}
          >
            <TrashIcon className="h-4 w-4" />
          </motion.button>
        </div>
      )
    }
  ]

  // API simulation functions
  const updateUser = async (userId: string, updates: Partial<TableUser>): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      ))
      
      return true
    } catch (error) {
      console.error('Failed to update user:', error)
      return false
    }
  }

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setUsers(prev => prev.filter(user => user.id !== userId))
      return true
    } catch (error) {
      console.error('Failed to delete user:', error)
      return false
    }
  }

  const adjustTokens = async (userId: string, adjustment: number): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, tokensLimit: Math.max(0, user.tokensLimit + adjustment) }
          : user
      ))
      return true
    } catch (error) {
      console.error('Failed to adjust tokens:', error)
      return false
    }
  }

  // Event handlers
  const handleSelectUser = useCallback((userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }, [])

  const handleSelectAll = useCallback(() => {
    setSelectedUsers(prev => 
      prev.length === users.length ? [] : users.map(user => user.id)
    )
  }, [users])

  const handleViewUser = (user: TableUser) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  const handleBulkAction = async (actionId: string): Promise<boolean> => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log(`Performing ${actionId} on users:`, selectedUsers)
      
      // Simulate different actions
      switch (actionId) {
        case 'activate':
          setUsers(prev => prev.map(user => 
            selectedUsers.includes(user.id) ? { ...user, status: 'active' } : user
          ))
          break
        case 'deactivate':
          setUsers(prev => prev.map(user => 
            selectedUsers.includes(user.id) ? { ...user, status: 'inactive' } : user
          ))
          break
        case 'suspend':
          setUsers(prev => prev.map(user => 
            selectedUsers.includes(user.id) ? { ...user, status: 'suspended' } : user
          ))
          break
        case 'delete':
          setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)))
          break
        default:
          console.log(`Action ${actionId} not implemented`)
      }
      
      return true
    } catch (error) {
      console.error('Bulk action failed:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      await deleteUser(userId)
    }
  }

  const handleAdjustTokens = async (userId: string, adjustment: number) => {
    await adjustTokens(userId, adjustment)
  }

  return (
    <AdminLayout requiredPermissions={['users.read']}>
      <motion.div 
        className="space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center"
          variants={staggerItem}
        >
          <div>
            <h1 className="text-2xl font-bold text-admin-text-primary">User Management</h1>
            <p className="text-admin-text-secondary">Manage user accounts, subscriptions, and support</p>
          </div>
          <div className="flex space-x-3">
            <motion.button 
              className="admin-button-secondary flex items-center space-x-2"
              whileHover={hoverAnimations.subtle}
              whileTap={clickAnimations.tap}
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>Export</span>
            </motion.button>
            <motion.button 
              className="admin-button-primary flex items-center space-x-2"
              whileHover={hoverAnimations.subtle}
              whileTap={clickAnimations.tap}
            >
              <UserPlusIcon className="h-4 w-4" />
              <span>Add User</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
          variants={staggerItem}
        >
          <motion.div 
            className="admin-card p-4"
            whileHover={hoverAnimations.lift}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-admin-text-secondary">Total Users</p>
                <p className="text-2xl font-bold text-admin-text-primary">{users.length}</p>
              </div>
              <div className="text-admin-accent">
                <UserPlusIcon className="h-8 w-8" />
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="admin-card p-4"
            whileHover={hoverAnimations.lift}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-admin-text-secondary">Active Users</p>
                <p className="text-2xl font-bold text-admin-text-primary">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <div className="text-green-600">
                <CheckCircleIcon className="h-8 w-8" />
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="admin-card p-4"
            whileHover={hoverAnimations.lift}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-admin-text-secondary">Premium Users</p>
                <p className="text-2xl font-bold text-admin-text-primary">
                  {users.filter(u => u.subscription === 'premium').length}
                </p>
              </div>
              <div className="text-purple-600">
                <CreditCardIcon className="h-8 w-8" />
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="admin-card p-4"
            whileHover={hoverAnimations.lift}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-admin-text-secondary">Suspended</p>
                <p className="text-2xl font-bold text-admin-text-primary">
                  {users.filter(u => u.status === 'suspended').length}
                </p>
              </div>
              <div className="text-red-600">
                <ExclamationTriangleIcon className="h-8 w-8" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectedUsers.length > 0 && (
            <BulkActionsBar
              selectedCount={selectedUsers.length}
              onClearSelection={() => setSelectedUsers([])}
              onAction={handleBulkAction}
            />
          )}
        </AnimatePresence>
        
        {/* Advanced Data Table */}
        <motion.div variants={staggerItem}>
          <AdvancedDataTable
            data={users}
            columns={columns}
            loading={loading}
            selectedRows={selectedUsers}
            onRowSelect={handleSelectUser}
            onSelectAll={handleSelectAll}
            onRowClick={handleViewUser}
          />
        </motion.div>

        {/* User Profile Modal */}
        <UserProfileModal
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false)
            setSelectedUser(null)
          }}
          user={selectedUser}
          onSave={async (updatedUser) => {
            if (selectedUser) {
              return await updateUser(selectedUser.id, updatedUser)
            }
            return false
          }}
          onDelete={async (userId) => {
            return await deleteUser(userId)
          }}
          onAdjustTokens={async (userId, adjustment) => {
            return await adjustTokens(userId, adjustment)
          }}
          loading={loading}
        />
      </motion.div>
    </AdminLayout>
  )
}