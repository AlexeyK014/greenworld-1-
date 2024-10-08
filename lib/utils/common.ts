import { closeAuthPopup, openAuthPopup, setIsAuth } from '@/context/auth'
import { setCurrentProduct } from '@/context/goods'
import {
  closeSearchModal,
  closeSizeTable,
  showSizeTable,
} from '@/context/modals'
import { setSizeTableSizes } from '@/context/sizeTable'
import { loginCheck } from '@/context/user'
import { ICartItem } from '@/types/cart'
import { IProduct } from '@/types/common'
import { EventCallable } from 'effector'
import toast from 'react-hot-toast'

// удаляет класс 'overflow-hidden'
export const removeOverflowHiddenFromBody = () => {
  const body = document.querySelector('body') as HTMLBodyElement
  body.classList.remove('overflow-hidden')
}

// добавляет класс 'overflow-hidden'
export const addOverflowHiddenToBody = (paddingRight = '') => {
  const body = document.querySelector('body') as HTMLBodyElement
  body.classList.add('overflow-hidden')
  paddingRight && (body.style.paddingRight = paddingRight)
}

// при находждение на клиенте получаем ширину окна
export const getWindowWidth = () => {
  const { innerWidth: windowWidth } =
    typeof window !== 'undefined' ? window : { innerWidth: 0 }

  return { windowWidth }
}

// закрытие модалки
export const handleCloseSearchModal = () => {
  closeSearchModal()
  removeOverflowHiddenFromBody()
}

// фун-я перемашивает массив, чтобы каждый раз товары приходили в разном порядке
export const shuffle = <T>(array: T[]) => {
  let currentIndex = array.length,
    randomIndex

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }
  return array
}

export const formatPrice = (x: number) =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

export const idGenerator = () => {
  const S4 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  )
}

export const closeSizeTableByCheck = (showQuickViewModal: boolean) => {
  if (!showQuickViewModal) {
    removeOverflowHiddenFromBody()
  }

  closeSizeTable()
}

// общая фун-я открытия модалки регистрации/входа
export const handleOpenAuthPopup = () => {
  addOverflowHiddenToBody()
  openAuthPopup()
}

// общая фун-я закрытия модалки регистрации/входа
export const handleCloseAuthPopup = () => {
  removeOverflowHiddenFromBody()
  closeAuthPopup()
}

//  проверяем открыта ли ещё какая нидубь модалка, чтобы не убират overflow
export const closeAuthPopupWhenSomeModalOpened = (
  // состояние модалок которые могут быть открыты
  showQuickModal: boolean,
  showSizeTable: boolean
) => {
  // если какая то модалки открыта, мы закрываем модалку авторизации
  if (showQuickModal || showSizeTable) {
    closeAuthPopup()
    return
  }

  handleCloseAuthPopup()
}

export const isUserAuth = () => {
  //  получаем токен из LS
  const auth = JSON.parse(localStorage.getItem('auth') as string)

  if (!auth?.accessToken) {
    setIsAuth(false)
    return false
  }

  return true
}

export const triggerLoginCheck = () => {
  if (!isUserAuth()) {
    return
  }

  const auth = JSON.parse(localStorage.getItem('auth') as string)

  // проверяем токен
  loginCheck({ jwt: auth.accessToken })
}

// определяем есть ли добавляемый товар уже в корзине
export const isItemInList = (array: ICartItem[], productId: string) =>
  array.some((item) => item.productId === productId)

// фун-я для вызова таблицы размеров
export const handleShowSizeTable = (product: IProduct) => {
  setCurrentProduct(product)
  setSizeTableSizes({ sizes: product.sizes, type: product.type })
  addOverflowHiddenToBody()
  showSizeTable()
}

//  поределяем нужное кол-во товаров
export const getCartItemCountBySize = (
  cartItems: ICartItem[],
  currentSize: string
) =>
  // с помщью метода find находим размер и определяем count
  cartItems.find((item) => item.size === currentSize.toLocaleLowerCase())
    ?.count || 0

// общая фун-я для удаления товара
export const deleteProductFromLS = <T>(
  id: string,
  key: string,
  event: EventCallable<T>,
  setShouldShowEmpty: (arg0: boolean) => void,
  message: string,
  withToast = true
) => {
  let items = JSON.parse(localStorage.getItem(key) as string)

  if (!items) {
    items = []
  }

  const updatedItems = items.filter(
    (item: { clientId: string }) => item.clientId !== id
  )

  localStorage.setItem(key, JSON.stringify(updatedItems))
  event(updatedItems)
  withToast && toast.success(message)

  if (!updatedItems.length) {
    setShouldShowEmpty(true)
  }
}

// для коректного отображения слов
export const showCountMessage = (count: string, lang: string) => {
  // в зависимости от length показываем разное
  if (count == '11' || count == '12' || count == '13' || count == '14') {
    return lang === 'ru' ? 'товаров' : 'items'
  }

  if (count.endsWith('1')) {
    return lang === 'ru' ? 'товар' : 'item'
  }

  if (count.endsWith('2') || count.endsWith('3') || count.endsWith('4')) {
    return lang === 'ru' ? 'товара' : 'items'
  }

  return lang === 'ru' ? 'товаров' : 'items'
}
