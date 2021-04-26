import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from 'react'

type AppStatus = 'idle' | 'authorized' | 'active'

type AppControllerState =
  | {
      status: Extract<AppStatus, 'idle'>
    }
  | {
      status: Exclude<AppStatus, 'idle'>
      projectId: string
      token: string
      roomName: string
      userName: string
    }

const initialState: AppControllerState = {
  status: 'idle',
}

const AppControllerStateContext = createContext<AppControllerState>(
  initialState
)
const AppControllerDispatchContext = createContext<
  Dispatch<AppControllerAction>
>(() => {})

type AppControllerAction =
  | {
      type: 'authorized'
      payload: {
        projectId: string
        token: string
        roomName: string
        userName: string
      }
    }
  | {
      type: 'client-ready'
    }
  | {
      type: 'reset'
    }

const reducer = (state: AppControllerState, action: AppControllerAction) => {
  switch (action.type) {
    case 'authorized': {
      const newState: AppControllerState = {
        ...state,
        status: 'authorized',
        ...action.payload,
      }

      return newState
    }

    case 'client-ready': {
      if (state.status === 'authorized') {
        const newState: AppControllerState = {
          ...state,
          status: 'active',
        }

        return newState
      }

      return state
    }

    case 'reset': {
      return initialState
    }

    default:
      return state
  }
}

interface AppControllerProps {
  children: ReactNode
}

export const AppController = ({ children }: AppControllerProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <AppControllerDispatchContext.Provider value={dispatch}>
      <AppControllerStateContext.Provider value={state}>
        {children}
      </AppControllerStateContext.Provider>
    </AppControllerDispatchContext.Provider>
  )
}

export const useAppState = () => {
  return useContext(AppControllerStateContext)
}

export const useAppDispatch = () => {
  return useContext(AppControllerDispatchContext)
}