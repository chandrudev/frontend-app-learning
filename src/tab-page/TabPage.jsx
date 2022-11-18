import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';

import Footer from '@edx/frontend-component-footer';
import { Toast } from '@edx/paragon';
import { LearningHeader as Header } from '@edx/frontend-component-header';
import PageLoading from '../generic/PageLoading';
import { getAccessDeniedRedirectUrl } from '../shared/access';
import { useModel } from '../generic/model-store';
import './Tabpage.scss';
import genericMessages from '../generic/messages';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import messages from './messages';
import LoadedTabPage from './LoadedTabPage';
import logo from './images/logo.svg';
import icon_coin_back from './images/icon_coin_back.svg';
import icon from './images/icon.svg';

import { setCallToActionToast } from '../course-home/data/slice';
import LaunchCourseHomeTourButton from '../product-tours/newUserCourseHomeTour/LaunchCourseHomeTourButton';

function TabPage({ intl, ...props }) {
  const {
    activeTabSlug,
    courseId,
    courseStatus,
    metadataModel,
    unitId,
  } = props;
  const {
    toastBodyLink,
    toastBodyText,
    toastHeader,
  } = useSelector(state => state.courseHome);
  const dispatch = useDispatch();
  const {
    canLoadCourseware,
    courseAccess,
    number,
    org,
    start,
    title,
  } = useModel('courseHomeMeta', courseId);

  if (courseStatus === 'loading') {
    return (
      <>
        <Header />
        <PageLoading
          srMessage={intl.formatMessage(messages.loading)}
        />
        {/* <Footer /> */}
      </>
    );
  }

  if (courseStatus === 'denied') {
    const redirectUrl = getAccessDeniedRedirectUrl(
      courseId, activeTabSlug, canLoadCourseware, courseAccess, start, unitId,
    );
    if (redirectUrl) {
      return (<Redirect to={redirectUrl} />);
    }
  }

  // Either a success state or a denied state that wasn't redirected above (some tabs handle denied states themselves,
  // like the outline tab handling unenrolled learners)
  if (courseStatus === 'loaded' || courseStatus === 'denied') {
    return (
      <>
        <Toast
          action={toastBodyText ? {
            label: toastBodyText,
            href: toastBodyLink,
          } : null}
          closeLabel={intl.formatMessage(genericMessages.close)}
          onClose={() => dispatch(setCallToActionToast({ header: '', link: null, link_text: null }))}
          show={!!(toastHeader)}
        >
          {toastHeader}
        </Toast>
        {metadataModel === 'courseHomeMeta' && (<LaunchCourseHomeTourButton srOnly />)}
        {/* <Header /> */}
        <div className="header">
          <img src="https://launchpadedx.s3.us-west-1.amazonaws.com/logo.png" style={{width: 135}} />
          <div className="menu-list">
            <ul  className= "menu">
              <li><a href={`${getConfig().LMS_BASE_URL}/dashboard`} style={{color: 'black'}}>Dashboard</a></li>
            <li><a>Learn</a></li>
            <li><a>Coding Lab</a></li>
          </ul>
          <ul className='right-menu'>
            <li><img src={icon_coin_back} /> <span>3</span> </li>
            <li><img src={icon} /> <span>1</span> </li>
            <li><img src="https://launchpadedx.s3.us-west-1.amazonaws.com/profile.png" /></li>
          </ul>
        </div>
        </div>
      <LoadedTabPage {...props} />
        {/* <Footer /> */}
      </>
    );
  }

  // courseStatus 'failed' and any other unexpected course status.
  return (
    <>
      <Header />
      <p className="text-center py-5 mx-auto" style={{ maxWidth: '30em' }}>
        {intl.formatMessage(messages.failure)}
      </p>
      {/* <Footer /> */}
    </>
  );
}

TabPage.defaultProps = {
  courseId: null,
  unitId: null,
};

TabPage.propTypes = {
  activeTabSlug: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  courseId: PropTypes.string,
  courseStatus: PropTypes.string.isRequired,
  metadataModel: PropTypes.string.isRequired,
  unitId: PropTypes.string,
};

export default injectIntl(TabPage);
