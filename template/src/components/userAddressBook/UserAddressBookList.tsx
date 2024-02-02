import { memo, useEffect, useMemo, useState } from "react"
import {
  App,
  Button,
  Col,
  List,
  Row,
  Select,
  SelectProps,
  Tree,
  TreeProps,
  Typography,
} from "antd"
import type { DataNode, EventDataNode } from "antd/es/tree"
import { CloseCircleFilled } from "@ant-design/icons"
import { useWxworkOrgs, useWxworkUsers } from "@/hooks"

const separator = "_"

const genOrgKey = (id: number) => ["org", id].join(separator)

const genOrgUserKey = (id: number, orgId: number) =>
  [genOrgKey(orgId), id].join(separator)

const getUserIdFromKey = (key: string) => {
  const arr = key.split(separator)
  if (arr.length === 3) return Number(arr.pop())
  return null
}

const getUserKeys = (user: API.WXWORK.OrgUser) => {
  if (!user.departmentIds) return []
  return user.departmentIds.map((orgId) =>
    genOrgUserKey(user.cybrosUserID, orgId)
  )
}

const getUserIdsFromKeys = (keys: string[]) => {
  const ids: Set<number> = new Set()
  keys.forEach((key) => {
    const id = getUserIdFromKey(key)
    if (id) ids.add(id)
  })
  return Array.from(ids)
}

const getKeysFromUsers = (users: API.WXWORK.OrgUser[]) => {
  const keys: string[] = []
  users.forEach((user) => {
    keys.push(...getUserKeys(user))
  })
  return keys
}

const genTree = (
  orgs?: API.WXWORK.Org[],
  users?: API.WXWORK.OrgUser[]
): TreeProps["treeData"] => {
  if (!orgs) return []
  return orgs.map((item) => {
    const userChildren = users
      ? users.filter((user) => user.departmentIds?.includes(item.ID))
      : []
    const orgChildren = genTree(item.children, users) || []
    return {
      key: genOrgKey(item.ID),
      title: item.name,
      children: [
        ...userChildren.map((user) => ({
          key: genOrgUserKey(user.cybrosUserID, item.ID),
          title: user.name,
          isLeaf: true,
        })),
        ...(orgChildren || []),
      ],
      disabled: userChildren.length === 0 && orgChildren.length === 0,
    }
  })
}

const getNodeLeafChildKeys = (node: EventDataNode<DataNode>) => {
  const keys: string[] = []
  if (node.children && node.children.length > 0) {
    node.children.forEach((item) => {
      if (item.isLeaf) {
        keys.push(item.key as string)
      } else {
        keys.push(...getNodeLeafChildKeys(item as EventDataNode<DataNode>))
      }
    })
  }
  return keys
}

type Props = React.RefAttributes<HTMLDivElement> & {
  value?: number[]
  onChange?: (value: number[]) => void
  max?: number
}

export const UserAddressBookList: React.FC<Props> = memo((props) => {
  const { value = [], onChange, max = 300, ...otherProps } = props
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const orgs = useWxworkOrgs()
  const users = useWxworkUsers()
  const [selectKeywords, setSelectKeywords] = useState<string>()

  const { message } = App.useApp()

  const treeData = useMemo(() => {
    return genTree(orgs, users)
  }, [orgs, users])

  const selectedUsers = useMemo(() => {
    if (!users) return []
    const userIds = getUserIdsFromKeys(checkedKeys)
    return users.filter((item) => userIds.includes(item.cybrosUserID))
  }, [users, checkedKeys])

  const selectOptions = useMemo(() => {
    if (!selectKeywords || !users) return []
    return users
      .filter((user) => user.name.includes(selectKeywords))
      .slice(0, 10)
      .map((user) => ({
        label: user.name,
        value: user.cybrosUserID,
      }))
  }, [selectKeywords, users])

  useEffect(() => {
    if (!users || !value) return
    const keys = getKeysFromUsers(
      users.filter((user) => value.includes(user.cybrosUserID))
    )
    setCheckedKeys(keys)
  }, [users, value])

  const handleChange = (userIds: number[]) => {
    if (onChange) onChange(userIds)
  }

  const handleCheck: TreeProps["onCheck"] = (keys, info) => {
    let userIds = getUserIdsFromKeys(keys as string[])
    if (info.node.isLeaf && !info.checked) {
      const userId = getUserIdFromKey(info.node.key as string)
      userIds = userIds.filter((item) => item !== userId)
    }
    if (!info.node.isLeaf && !info.checked) {
      const leafChildKeys = getNodeLeafChildKeys(info.node)
      const ids = getUserIdsFromKeys(leafChildKeys)
      userIds = userIds.filter((item) => !ids.includes(item))
    }
    if (userIds.length > max) {
      message.warning(`最多支持选择${max}个人`)
    } else {
      handleChange(userIds)
    }
  }

  const handleRemove = (user: API.WXWORK.OrgUser) => {
    const userKeys = getUserKeys(user)
    const keys = checkedKeys.filter((item) => !userKeys.includes(item))
    handleChange(getUserIdsFromKeys(keys))
  }

  const handleSelectSearch: SelectProps["onSearch"] = (keywords) => {
    setSelectKeywords(keywords.trim())
  }

  const handleSelectChange: SelectProps["onChange"] = (id: number) => {
    setSelectKeywords("")
    if (value.includes(id)) return
    const newUserIds = [...value, id]
    handleChange(newUserIds)
  }

  return (
    <Row {...otherProps}>
      <Col span={12} className="border-0 border-r border-solid border-gray-200">
        <div className="sticky top-0 p-2 border-0 border-b border-solid border-gray-200 h-12">
          <Select
            className="w-full"
            placeholder="搜索"
            filterOption={false}
            showSearch
            onSearch={handleSelectSearch}
            options={selectOptions}
            value={null}
            onChange={handleSelectChange}
          />
        </div>
        <div className="p-2 h-96 overflow-auto">
          <Typography.Text>天华建筑设计</Typography.Text>
          <Tree
            className="mt-2"
            checkable
            checkedKeys={checkedKeys}
            treeData={treeData}
            onCheck={handleCheck}
            selectable={false}
          />
        </div>
      </Col>
      <Col span={12}>
        <div className="p-2 h-12 border-0 border-b border-solid border-gray-200 flex items-center">
          {selectedUsers.length === 0
            ? "请选择"
            : `已选择-${selectedUsers.length}`}
        </div>
        <List
          className="h-96 overflow-auto"
          dataSource={selectedUsers}
          renderItem={(item) => {
            return (
              <div className="my-2 px-2 flex justify-between items-center hover:bg-gray-100">
                <div>{item.name}</div>
                <Button
                  type="text"
                  shape="circle"
                  className="p-0 text-gray-300"
                  onClick={() => handleRemove(item)}
                >
                  <CloseCircleFilled />
                </Button>
              </div>
            )
          }}
        />
      </Col>
    </Row>
  )
})
