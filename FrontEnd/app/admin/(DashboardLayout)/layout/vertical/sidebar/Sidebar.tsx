'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from 'flowbite-react';
import SidebarContent from './Sidebaritems';
import NavItems from './NavItems';
import NavCollapse from './NavCollapse';
import SimpleBar from 'simplebar-react';
import FullLogo from '../../shared/logo/FullLogo';
import { Icon } from '@iconify/react';
import Upgrade from './Upgrade';
import Image from 'next/image';
import {
  isAuthenticated,
  getUserData,
  getRole,
  processGoogleDriveLink,
} from '@/app/utils/utils';
import Link from 'next/link';
import LogoutButton from '@/components/Header/LogoutBtn';

const SidebarLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState('');
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    role: '',
    avatar_url: '',
  });

  const filteredSidebarItems = SidebarContent.map((section) => ({
    ...section,
    children: section.children.filter(
      (child) => !child.role || child.role.includes(getRole(user))
    ),
  })).filter((section) => section.children.length > 0);

  useEffect(() => {
    const loggedIn = isAuthenticated();
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      const userData = getUserData();
      setUser(userData);

      if (userData.avatar_url) {
        setAvatarSrc(
          processGoogleDriveLink(userData.avatar_url) || '/images/default.png'
        );
      }
    }
  }, []);

  return (
    <>
      <div className="xl:block hidden">
        <div className="flex">
          <Sidebar
            className="fixed menu-sidebar pt-6 bg-white dark:bg-darkgray z-[10]"
            aria-label="Sidebar with multi-level dropdown example"
          >
            <div className="mb-7 px-4 brand-logo">
              <FullLogo />
            </div>

            <SimpleBar className="h-[calc(100vh_-_120px)]">
              <Sidebar.Items className="px-4">
                <Sidebar.ItemGroup className="sidebar-nav">
                  {filteredSidebarItems.map((item, index) => (
                    <React.Fragment key={index}>
                      <h5 className="text-link font-semibold text-sm caption">
                        <span className="hide-menu">{item.heading}</span>
                      </h5>
                      <Icon
                        icon="solar:menu-dots-bold"
                        className="text-ld block mx-auto mt-6 leading-6 dark:text-opacity-60 hide-icon"
                        height={18}
                      />

                      {item.children?.map((child, index) => (
                        <React.Fragment key={child.id && index}>
                          {child.children ? (
                            <div className="collpase-items">
                              <NavCollapse item={child} />
                            </div>
                          ) : (
                            <NavItems item={child} />
                          )}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup className="sidebar-nav flex">
                  <>
                    <Link href="/pages/profile">
                      <Image
                        src={avatarSrc}
                        alt=""
                        width={36}
                        height={36}
                        className="rounded-full mr-2 mt-4"
                      />
                    </Link>
                    <span className="mr-4 text-base font-medium text-dark dark:text-white">
                      {`${user?.name}`}
                    </span>
                    <LogoutButton />
                  </>
                </Sidebar.ItemGroup>
              </Sidebar.Items>
              <Upgrade />
            </SimpleBar>
          </Sidebar>
        </div>
      </div>
    </>
  );
};

export default SidebarLayout;
