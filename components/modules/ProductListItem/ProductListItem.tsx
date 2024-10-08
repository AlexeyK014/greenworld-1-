import { useLang } from '@/hooks/useLang'
import { IProductListItemProps } from '@/types/modules'
import styles from '@/styles/product-list-item/index.module.scss'
import ProductLabel from './ProductLabel'
import ProductItemActionBtn from '@/components/elements/ProductItemActionBtn/ProductItemActionBtn'
import Image from 'next/image'
import Link from 'next/link'
import ProductAvailable from '@/components/elements/ProductAvailable/ProductAvailable'
import {
  addOverflowHiddenToBody,
  formatPrice,
  isItemInList,
} from '@/lib/utils/common'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { showQuickModal } from '@/context/modals'
import { setCurrentProduct } from '@/context/goods'
import { productsWithoutSizes } from '@/constants/product'
import { useCartAction } from '@/hooks/useCartAction'
import { addProductToCartBySizeTable } from '@/lib/utils/cart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const ProductListItem = ({ item, title }: IProductListItemProps) => {
  const { lang, translations } = useLang()
  const isTitleForNew = title === translations[lang].main_page.new_title
  const isMedia800 = useMediaQuery(800)
  const { addToCartSpinner, currentCartByAuth, setAddToCartSpinner } =
    useCartAction()
  const isProductInCart = isItemInList(currentCartByAuth, item._id)

  const handleShowQuickViewModal = () => {
    addOverflowHiddenToBody()
    showQuickModal()
    setCurrentProduct(item)
  }

  const addToCart = () =>
    addProductToCartBySizeTable(item, setAddToCartSpinner, 1)

  return (
    <>
      {/* {item.characteristics.collection === 'line' &&
      item.type === 't-shirts' ? (
        <li>

        </li>
      ) : (
        <></>
      )} */}
      <li className={styles.list__item}>
        {title ? (
          <span
            className={`${styles.list__item__label} ${
              isTitleForNew
                ? styles.list__item__new
                : styles.list__item__bestseller
            }`}
          >
            {isTitleForNew
              ? translations[lang].main_page.is_new
              : translations[lang].main_page.is_bestseller}
          </span>
        ) : !item.isNew && !item.isBestseller ? (
          ''
        ) : (
          <ProductLabel isBestseller={item.isBestseller} isNew={item.isNew} />
        )}
        <div className={styles.list__item__actions}>
          <ProductItemActionBtn
            text={translations[lang].product.add_to_favorites}
            iconClass='actions__btn_favorite'
          />
          <ProductItemActionBtn
            text={translations[lang].product.add_to_comparison}
            iconClass='actions__btn_comparison'
          />
          {!isMedia800 && (
            <ProductItemActionBtn
              text={translations[lang].product.quick_view}
              iconClass='actions__btn_quick_view'
              callback={handleShowQuickViewModal}
            />
          )}
        </div>
        <Link
          href={`/catalog/${item.category}/${item._id}`}
          className={styles.list__item__img}
        >
          <Image src={item.images[0]} alt={item.name} fill />
        </Link>

        <div className={styles.list__item__inner}>
          <h3 className={styles.list__item__title}>
            <Link href={`/catalog/${item.category}/${item._id}`}>
              {item.name}
            </Link>
          </h3>
          <ProductAvailable
            vendorCode={item.vendorCode}
            inStock={+item.inStock}
          />
          <span className={styles.list__item__price}>
            {formatPrice(+item.price)} P
          </span>
        </div>

        {productsWithoutSizes.includes(item.type) ? (
          <button
            onClick={addToCart}
            className={`btn-reset ${styles.list__item__cart} ${
              isProductInCart ? styles.list__item__cart_added : ''
            }`}
            disabled={addToCartSpinner}
            style={addToCartSpinner ? { minWidth: 125, height: 48 } : {}}
          >
            {addToCartSpinner ? (
              <FontAwesomeIcon icon={faSpinner} spin color='fff' />
            ) : isProductInCart ? (
              translations[lang].product.in_cart
            ) : (
              translations[lang].product.to_cart
            )}
          </button>
        ) : (
          <button
            className={`btn-reset ${styles.list__item__cart}`}
            onClick={addToCart}
          >
            {translations[lang].product.to_cart}
          </button>
        )}
      </li>
    </>
  )
}

export default ProductListItem
