'use client'
import { useLang } from '@/hooks/useLang'
import styles from '@/styles/product-list-item/index.module.scss'

const ProductColor = ({ color }: { color: string }) => {
  const { lang, translations } = useLang()

  return (
    <span className={styles.product__color}>
      {(translations[lang].catalog as { [index: string]: string })[color]}
    </span>
  )
}

export default ProductColor
