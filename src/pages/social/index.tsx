import CCard from '@/components/CCard';
import Loading from '@/components/popup/Loading';
import ModalAddPost from '@/components/social/ModalAddPost';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import ModalMention from '@/containers/circle/[id]/ModalMention';
import PostSection from '@/containers/circle/[id]/PostSection';
import Card1 from '@/containers/social/main/Card1';
import Card2 from '@/containers/social/main/Card2';
import { isGuest } from '@/helpers/guest';
import withAuth from '@/helpers/withAuth';
import { getUserInfo } from '@/repository/profile.repository';
import {
  getSocialPostFollowing,
  getSocialPostForYou,
  getSocialPostMySpace
} from '@/repository/social.respository';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography
} from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface UserData {
  id: any;
  name: string;
  seedsTag: string;
  email: string;
  pin: string;
  avatar: string;
  bio: string;
  birthDate: string;
  phone: string;
  preferredLanguage: string;
  _pin: string;
  verified: boolean;
}

interface optionSortBy {
  title: string;
  subtitle: string;
  value: string;
}

interface Filter {
  page: number;
  limit: number;
  type: string;
  sort_by: string;
}

const initialUserInfo = {
  id: '',
  name: '',
  seedsTag: '',
  email: '',
  pin: '',
  avatar: '',
  bio: '',
  birthDate: '',
  phone: '',
  preferredLanguage: '',
  verified: false,
  _pin: ''
};

const initialFilter = {
  page: 1,
  limit: 10,
  type: 'all',
  sort_by: ''
};

const Social: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>(
    isGuest() ? 'for_you' : 'for_you'
  );
  const [userInfo, setUserInfo] = useState<UserData>(initialUserInfo);
  const [dataPost, setDataPost] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [golId, setGolId] = useState<number>(1);
  const [isLoadingPost, setIsLoadingPost] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [isOpen, setIsOpen] = useState(false);
  const [isIncrease, setIsIncrease] = useState(false);
  const [isOpenModalAdd, setIsOpenModalAdd] = useState<boolean>(false);
  const optionsFilter: optionSortBy[] = [
    {
      title: t('social.fiterSortBy.all'),
      subtitle: t('social.fiterSortBy.allDesc'),
      value: ''
    },
    {
      title: t('social.fiterSortBy.recent'),
      subtitle: t('social.fiterSortBy.recentDesc'),
      value: 'recent'
    },
    {
      title: t('social.fiterSortBy.relevant'),
      subtitle: t('social.fiterSortBy.relevantDesc'),
      value: 'relevant'
    },
    {
      title: t('social.fiterSortBy.like'),
      subtitle: t('social.fiterSortBy.likeDesc'),
      value: 'liked'
    },
    {
      title: t('social.fiterSortBy.trending'),
      subtitle: t('social.fiterSortBy.trendingDesc'),
      value: 'trending'
    }
  ];

  const handleOpen = (): void => {
    if (isOpen) {
      document.body.classList.remove('modal-open');
    } else {
      document.body.classList.add('modal-open');
    }
    setIsOpen(!isOpen);
  };

  const handleChangeTab = (value: string): void => {
    setActiveTab(value);
    setDataPost([]);
    setHasMore(true);
    setFilter(prevState => ({
      ...prevState,
      type: 'all',
      page: 1
    }));
    if (value === 'following') {
      void fetchPostFollowing();
    }

    if (value === 'for_you') {
      void fetchPostForYou();
    }

    if (value === 'space') {
      void fetchPostMySpace();
    }
  };

  const handleChangeFilter = (name: string, value: string | number): void => {
    setDataPost([]);
    setHasMore(true);
    setFilter(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const fetchUserInfo = async (): Promise<void> => {
    try {
      const response = await getUserInfo();
      setUserInfo(response);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPostFollowing = async (): Promise<void> => {
    try {
      setIsLoadingPost(true);
      getSocialPostFollowing(filter)
        .then(res => {
          const data: any[] = res.data;
          const total = res.metadata.total;

          if (res.data !== null) {
            setDataPost(prevState => [...prevState, ...data]);
            if (dataPost.length + data.length < total) {
              setHasMore(true);
            } else {
              setHasMore(false);
            }
          } else {
            setHasMore(false);
          }
          setIsIncrease(false);
          setIsLoadingPost(false);
        })
        .catch(err => {
          console.log(err);
          setIsIncrease(false);
          setIsLoadingPost(false);
        });
    } catch (error) {
      setIsIncrease(false);
      setIsLoadingPost(false);
      console.log(error);
    }
  };

  const fetchPostForYou = async (): Promise<void> => {
    try {
      setIsLoadingPost(true);
      getSocialPostForYou(filter)
        .then(res => {
          const data: any[] = res.data;
          const total = res.metadata.total;

          if (res.data !== null) {
            setDataPost(prevState => [...prevState, ...data]);
            if (dataPost.length + data.length < total) {
              setHasMore(true);
            } else {
              setHasMore(false);
            }
          } else {
            if (dataPost.length + data.length < total) {
              setHasMore(true);
            } else {
              setHasMore(false);
            }
          }
          setIsIncrease(false);
          setIsLoadingPost(false);
        })
        .catch(err => {
          console.log(err);
          setIsIncrease(false);
          setIsLoadingPost(false);
        });
    } catch (error) {
      setIsIncrease(false);
      setIsLoadingPost(false);
      console.log(error);
    }
  };

  const fetchPostMySpace = async (): Promise<void> => {
    try {
      setIsLoadingPost(true);
      getSocialPostMySpace(filter)
        .then(res => {
          const data: any[] = res.data;
          const total = res.metadata.total;

          if (res.data !== null) {
            setDataPost(prevState => [...prevState, ...data]);
            if (dataPost.length + data.length < total) {
              setHasMore(true);
            } else {
              setHasMore(false);
            }
          } else {
            if (dataPost.length + data.length < total) {
              setHasMore(true);
            } else {
              setHasMore(false);
            }
          }
          setIsLoadingPost(false);
          setIsIncrease(false);
        })
        .catch(err => {
          console.log(err);
          setIsIncrease(false);
          setIsLoadingPost(false);
        });
    } catch (error) {
      setIsIncrease(false);
      setIsLoadingPost(false);
      console.log(error);
    }
  };

  useEffect(() => {
    void fetchUserInfo();
    if (isGuest()) {
      void fetchPostForYou();
    }
  }, []);

  const renderLoading = (): JSX.Element => (
    <div className="flex justify-center h-10 pt-4">
      <div className="h-72 absolute">
        <div className="animate-spinner w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
      </div>
    </div>
  );

  const handleScroll = (): void => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 20 && !isLoadingPost) {
      if (!isIncrease) {
        setIsIncrease(true);
        setTimeout(() => {
          setFilter(prevState => ({
            ...prevState,
            page: prevState.page + 1
          }));
        }, 1000);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (hasMore) {
      if (activeTab === 'following') {
        void fetchPostFollowing();
      }

      if (activeTab === 'for_you') {
        void fetchPostForYou();
      }

      if (activeTab === 'space') {
        void fetchPostMySpace();
      }
    }
  }, [activeTab, filter.page, filter.sort_by, golId, filter.type]);

  return (
    <PageGradient defaultGradient className="w-full">
      {isLoading && <Loading />}
      <ModalMention
        open={isOpen}
        handleOpen={handleOpen}
        setIsLoading={setIsLoading}
        setIsLoadingPost={setIsLoadingPost}
        setFilter={setFilter}
        setData={setDataPost}
        setGolId={setGolId}
      />
      <ModalAddPost
        isOpen={isOpenModalAdd}
        handleOpen={() => {
          setIsOpenModalAdd(false);
        }}
        openModalPost={() => {
          handleOpen();
          setIsOpenModalAdd(false);
        }}
      />

      <Card1
        activeTab={activeTab}
        setActiveTab={handleChangeTab}
        changeFilter={handleChangeFilter}
        filter={filter}
      />

      {!isGuest() && (
        <div className="fixed bottom-10 right-10 z-20">
          <div className="bg-[#3AC4A0] p-2 rounded-full">
            <PlusIcon
              width={50}
              height={50}
              className="text-white"
              onClick={() => {
                setIsOpenModalAdd(true);
              }}
            />
          </div>
        </div>
      )}

      {isGuest() ? (
        <></>
      ) : (
        <Card2 userData={userInfo} handleOpen={handleOpen} />
      )}

      <CCard className="flex p-8 md:mt-5 md:rounded-lg border-none rounded-none pb-10">
        <div className="flex justify-end">
          <div className="absolute top-4 bg-white p-2 cursor-pointer">
            <Menu>
              <MenuHandler>
                <div className="flex items-center gap-2">
                  {optionsFilter
                    .map((data: optionSortBy) => {
                      if (data.value === filter.sort_by) {
                        return (
                          <Typography
                            className="text-xs text-neutral-soft font-poppins"
                            key={data.value}
                          >
                            {data.title}
                          </Typography>
                        );
                      }
                      return undefined;
                    })
                    .filter(Boolean)}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M13.9423 4.66666H2.05752C1.79024 4.66666 1.65639 4.9898 1.84538 5.17879L7.78779 11.1212C7.90494 11.2383 8.09489 11.2383 8.21205 11.1212L14.1545 5.17879C14.3434 4.9898 14.2096 4.66666 13.9423 4.66666Z"
                      fill="#7C7C7C"
                    />
                  </svg>
                </div>
              </MenuHandler>
              <MenuList className="w-2/6 lg:w-1/6">
                {optionsFilter.map((data, idx) => (
                  <MenuItem
                    key={idx}
                    className={`mb-2 ${
                      filter.sort_by === data.value ? 'bg-[#DCFCE4]' : ''
                    }`}
                    onClick={() => {
                      if (filter.sort_by !== data.value) {
                        handleChangeFilter('sort_by', data.value);
                        handleChangeFilter('page', 1);
                      }
                    }}
                  >
                    <h1 className="font-semibold font-montserrat text-xs">
                      {data.title}
                    </h1>
                    <p className="font-normal font-montserrat text-xs">
                      {data.subtitle}
                    </p>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </div>
        </div>
        <div className="flex justify-start w-full border border-neutral-ultrasoft" />
        {dataPost.length > 0 &&
          dataPost.map((el: any, idx: number) => {
            return (
              <div className="flex flex-col" key={`${el.id as string} ${idx}`}>
                {el.circle !== undefined && (
                  <div
                    className={`flex justify-between p-2 rounded-t-2xl px-4 ${
                      el?.circle?.status_joined === true
                        ? 'bg-[#E9E9E9]'
                        : 'bg-[#DCFCE4]'
                    } mt-5`}
                  >
                    <div className="flex items-center">
                      <img
                        src={el?.circle?.avatar}
                        alt="image"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <Typography
                        className={`text-sm text-black px-2 py-1 font-bold`}
                      >
                        {el?.circle?.name}
                      </Typography>
                    </div>
                    <button
                      className={`${
                        el?.circle?.status_joined === true
                          ? 'bg-[#BDBDBD] cursor-not-allowed'
                          : 'bg-seeds-button-green'
                      } rounded-full`}
                    >
                      <Typography
                        className={`text-sm ${
                          el?.circle?.status_joined === true
                            ? 'text-neutral-soft'
                            : 'text-white'
                        } px-2 py-1 font-bold`}
                        onClick={() => {
                          if (el?.circle?.status_joined === false) {
                            router
                              .push(`/connect/post/${el?.circle_id as string}`)
                              .catch(err => {
                                console.error(err);
                              });
                          }
                        }}
                      >
                        {el?.circle?.status_joined === true
                          ? t('circleDetail.statusJoined')
                          : t('circleDetail.statusNotJoined')}
                      </Typography>
                    </button>
                  </div>
                )}
                <PostSection
                  dataPost={el}
                  setData={setDataPost}
                  userInfo={userInfo}
                />
              </div>
            );
          })}
        {isLoadingPost && renderLoading()}
      </CCard>
    </PageGradient>
  );
};

export default withAuth(Social);
