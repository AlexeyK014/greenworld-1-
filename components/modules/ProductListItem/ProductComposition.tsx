import { useLang } from '@/hooks/useLang'
import styles from '@/styles/product-list-item/index.module.scss'

const ProductComposition = ({ composition }: { composition: string }) => {
  const { lang, translations } = useLang()
  return (
    <span className={styles.product__composition}>
      {translations[lang].product.composition}:{' '}
      {/**eslint-disable-next-line @typescript-eslint/ban-ts-comment
      {/* @ts-ignore */}
      {translations[lang].product[composition]}
    </span>
  )
}

export default ProductComposition
