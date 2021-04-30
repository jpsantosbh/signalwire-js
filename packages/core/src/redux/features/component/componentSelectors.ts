import { SDKState } from '../../interfaces'

export const getComponent = ({ components }: SDKState, id: string) => {
  return components.byId?.[id]
}