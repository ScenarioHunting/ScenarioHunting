import * as styles from './sidebar.style.css';
import * as React from 'react';
import { TestRecorder } from '../scenario-builder/scenario-builder.component';
import { TemplateList } from '../template-processing/template-list';
import { Routes,Route, Link, BrowserRouter,Navigate } from 'react-router-dom';

export const Sidebar = function () {

  return <BrowserRouter>
    <div style={{ width: '100%' }}>
      <nav className={styles['sidebar-nav']}>
        <Link title="Build scenario" to="/">
          <svg viewBox="0 0 512 512">
            <g>
              <path d="M445.9,427.1L328,227.9V78c0-7.7-6.5-14-14.5-14c-8,0-14.5,6.2-14.5,14v153.6c0,1.8,0.6,3.6,1.3,5.3   c-7.6-11.1-20.6-18.4-35.4-18.4c-23.5,0-42.5,18.3-42.5,41c0,16.8,10.5,31.5,25.4,37.5h-72l35-58.5c1.2-2.1,2.1-4.5,2.1-6.9v-30.4   c4,3.2,10,5.1,16.1,5.1c15.3,0,27.5-11.9,27.5-26.6c0-14.7-12.2-26.6-27.5-26.6c-6.1,0-12.1,1.9-16.1,5.1V78c0-7.7-6.5-14-14.5-14   c-8,0-14.5,6.2-14.5,14v149.9L66.1,427.1c-2.5,4.3-2.6,9.6,0,13.9c2.6,4.3,7.2,7,12.4,7H256h177.5c5.1,0,9.8-2.6,12.4-7   C448.5,436.8,448.4,431.4,445.9,427.1z M282.2,297c14.9-6,25.4-20.8,25.4-37.5c0-5.7-1.2-11.2-3.4-16.1l31,53.6H282.2z" />
              <path d="M265.1,128.6c12,0,21.7-9.4,21.7-20.9c0-11.6-9.7-20.9-21.7-20.9c-12,0-21.7,9.4-21.7,20.9   C243.3,119.2,253.1,128.6,265.1,128.6z" />
            </g>
          </svg>
        </Link>
        <a href='http://scenariohunting.com' style={{
          textDecoration: 'none',
          fontWeight:'bold',
          background: 'linear-gradient(120deg, #47e4e0, #155799)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }} target='_blank' rel="noreferrer"><img width={12} height={12} src='https://raw.githubusercontent.com/ScenarioHunting/website/gh-pages/favicon.ico'/> Learn</a> 
        <Link title="Templates" to="/template-list">
          <svg viewBox="0 0 32 32" >
            <path d="M27,4H5C3.3,4,2,5.3,2,7v18c0,1.7,1.3,3,3,3h22c1.7,0,3-1.3,3-3V7C30,5.3,28.7,4,27,4z M9.1,7.6c0.1-0.1,0.1-0.2,0.2-0.3  c0.1-0.1,0.2-0.2,0.3-0.2C10,6.9,10.4,7,10.7,7.3c0.1,0.1,0.2,0.2,0.2,0.3C11,7.7,11,7.9,11,8c0,0.3-0.1,0.5-0.3,0.7  C10.5,8.9,10.3,9,10,9C9.7,9,9.5,8.9,9.3,8.7C9.1,8.5,9,8.3,9,8C9,7.9,9,7.7,9.1,7.6z M6,8c0-0.3,0.1-0.5,0.3-0.7  c0,0,0.1-0.1,0.1-0.1c0.1,0,0.1-0.1,0.2-0.1C6.7,7,6.7,7,6.8,7c0.1,0,0.3,0,0.4,0c0.1,0,0.1,0,0.2,0.1c0.1,0,0.1,0.1,0.2,0.1  c0,0,0.1,0.1,0.1,0.1c0.1,0.1,0.2,0.2,0.2,0.3C8,7.7,8,7.9,8,8c0,0.1,0,0.3-0.1,0.4C7.9,8.5,7.8,8.6,7.7,8.7C7.5,8.9,7.3,9,7,9  S6.5,8.9,6.3,8.7C6.1,8.5,6,8.3,6,8z M11.7,21.3c0.4,0.4,0.4,1,0,1.4C11.5,22.9,11.3,23,11,23s-0.5-0.1-0.7-0.3l-3-3  c-0.4-0.4-0.4-1,0-1.4l3-3c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4L9.4,19L11.7,21.3z M12.6,8.9c-0.1-0.1-0.2-0.1-0.3-0.2  c-0.1-0.1-0.2-0.2-0.2-0.3C12,8.3,12,8.1,12,8c0-0.1,0-0.3,0.1-0.4c0.1-0.1,0.1-0.2,0.2-0.3c0.4-0.4,1-0.4,1.4,0  c0.1,0.1,0.2,0.2,0.2,0.3C14,7.7,14,7.9,14,8c0,0.1,0,0.3-0.1,0.4c-0.1,0.1-0.1,0.2-0.2,0.3C13.5,8.9,13.3,9,13,9  C12.9,9,12.7,9,12.6,8.9z M18.9,15.4l-4,8C14.7,23.8,14.4,24,14,24c-0.2,0-0.3,0-0.4-0.1c-0.5-0.2-0.7-0.8-0.4-1.3l4-8  c0.2-0.5,0.8-0.7,1.3-0.4C18.9,14.4,19.1,15,18.9,15.4z M24.7,19.7l-3,3C21.5,22.9,21.3,23,21,23s-0.5-0.1-0.7-0.3  c-0.4-0.4-0.4-1,0-1.4l2.3-2.3l-2.3-2.3c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l3,3C25.1,18.7,25.1,19.3,24.7,19.7z" />
          </svg>
        </Link>
      </nav>
      <svg style={{ paddingLeft: '13px', paddingBottom:'13px' }} width="320" height="1" viewBox="0 0 292 1" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="292" height="1" fill="#E1E0E7" />
      </svg>
      <Routes>
        <Route index element={<TestRecorder/>}  />
        <Route element={<TemplateList/>} path="template-list" />
        <Route path="*" element={<Navigate to ="/" />}/>
      </Routes>

    </div>
  </BrowserRouter>;
};
