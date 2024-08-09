'use client'
import { $profileIsOpen } from '@/context/modals'
import { useLang } from '@/hooks/useLang'
import { useUnit } from 'effector-react'
import React from 'react'

const Profile = () => {
  const isOpenProfile = useUnit($profileIsOpen)
  const { lang, translations } = useLang()
  console.log('profile')

  return (
    <div>
      {isOpenProfile && (
        <div>
          {translations[lang].breadcrumbs.catalog}
          <div>Горох</div>
          <div>Редис</div>
          <div>Базелик</div>
          <div>Амарант</div>
        </div>
      )}
    </div>
  )
}

export default Profile
