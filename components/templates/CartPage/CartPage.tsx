'use client'
import { getCartItemsFx } from '@/api/cart'
import HeadeingWithCount from '@/components/elements/HeadingWithCount/HeadeingWithCount'
import Breadcrumbs from '@/components/modules/Breadcrumbs/Breadcrumbs'
import CartList from '@/components/modules/CartPage/CartList'
import PromotionalCode from '@/components/modules/CartPage/PromotionalCode'
import EmptyPageContent from '@/components/modules/EmptyPageContent/EmptyPageContent'
import OrderInfoBlock from '@/components/modules/OrderInfoBlock/OrderInfoBlock'
import { basePropsForMotion } from '@/constants/motion'
import { $shouldShowEmpty } from '@/context/cart'
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs'
import { useCartByAuth } from '@/hooks/useCartByAuth'
import { useLang } from '@/hooks/useLang'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { countWholeCartItemsAmount } from '@/lib/utils/cart'
import styles from '@/styles/cart-page/index.module.scss'
import cartSkeletonStyles from '@/styles/cart-skeleton/index.module.scss'
import { useUnit } from 'effector-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const CartPage = () => {
  const cartSpinner = useUnit(getCartItemsFx.pending)
  const currentCartByAuth = useCartByAuth()
  const { lang, translations } = useLang()
  const { getDefaultTextGenerator, getTextGenerator } = useBreadcrumbs('cart')
  const isMedia930 = useMediaQuery(930)
  const [isCorrectPromotionCode, setIsCorrectPromotionCode] = useState(false)
  const shouldShowEmpty = useUnit($shouldShowEmpty)
  return (
    <main>
      <Breadcrumbs
        getDefaultTextGenerator={getDefaultTextGenerator}
        getTextGenerator={getTextGenerator}
      />
      {!shouldShowEmpty ? (
        <section className={styles.cart}>
          <div className='container'>
            <HeadeingWithCount
              count={countWholeCartItemsAmount(currentCartByAuth)}
              title={translations[lang].breadcrumbs.cart}
              spinner={cartSpinner}
            />
            <div className={styles.cart__inner}>
              <div className={styles.cart__left}>
                {cartSpinner && (
                  <motion.ul
                    {...basePropsForMotion}
                    className={cartSkeletonStyles.skeleton}
                  >
                    {Array.from(new Array(3)).map((_, i) => (
                      <li key={i} className={cartSkeletonStyles.skeleton__item}>
                        <div
                          className={cartSkeletonStyles.skeleton__item__light}
                        />
                      </li>
                    ))}
                  </motion.ul>
                )}
                {!cartSpinner && (
                  <motion.ul
                    {...basePropsForMotion}
                    className={`list-reset ${styles.cart__list}`}
                  >
                    <CartList />
                  </motion.ul>
                )}
              </div>
              <div className={styles.cart__right}>
                {isMedia930 && (
                  <PromotionalCode
                    setIsCorrectPromotionCode={setIsCorrectPromotionCode}
                  />
                )}
                <div className={styles.cart__right__order}>
                  <OrderInfoBlock
                    isCorrectPromotionCode={isCorrectPromotionCode}
                  />
                </div>
              </div>
            </div>

            {!isMedia930 && (
              <PromotionalCode
                setIsCorrectPromotionCode={setIsCorrectPromotionCode}
              />
            )}
          </div>
        </section>
      ) : (
        <section>
          <div className='container'>
            <EmptyPageContent
              subtitle={translations[lang].common.cart_empty}
              description={translations[lang].common.cart_empty_advice}
              btnText={translations[lang].common.go_shopping}
              bgClassName={styles.empty_bg}
            />
          </div>
        </section>
      )}
    </main>
  )
}

export default CartPage
