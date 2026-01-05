<template>
  <div id="app" class="main-container" :class="{ 'mac-glass': isMacGlass }">
    <div class="title-bar">
      <div class="title-drag-region"></div>
      <div class="app-title">{{ t('app.title') }}</div>
      <div class="title-bar-controls">
        <button @click="openGithub" class="icon-btn no-drag" title="GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </button>
        <button @click="toggleLanguage" class="icon-btn no-drag" :title="locale === 'zh-CN' ? 'Switch to English' : '切换到中文'">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </button>
      </div>
    </div>
    <header class="app-header">
      <div class="header-left">
        <h1>{{ t('app.title') }}</h1>
      </div>
      <div class="header-right">
        <span v-if="isLoggedIn" class="user-info">{{ userInfo.stuNo }} {{ userInfo.name }}</span>
        <button v-if="isLoggedIn" @click="handleLogout" class="logout-btn">
          {{ t('login.logout') }}
        </button>
      </div>
    </header>
    
    <main class="app-main">
      <LoginForm v-if="!isLoggedIn" @login-success="handleLoginSuccess" />
      <ReportGenerator v-else :user-info="userInfo" />
    </main>

    <footer class="app-footer">
      <p>{{ t('app.footer') }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import LoginForm from './components/LoginForm.vue';
import ReportGenerator from './components/ReportGenerator.vue';

const { locale, t } = useI18n();
const isLoggedIn = ref(false);
const userInfo = ref({
  stuNo: '',
  name: '',
  sessionId: ''
});

const isMacGlass = !!window.electronAPI && window.electronAPI.platform === 'darwin';

const toggleLanguage = () => {
  locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN';
};

const openGithub = () => {
  if (window.electronAPI?.openExternal) {
    window.electronAPI.openExternal('https://github.com/wztxy/MyCampusCard');
  } else {
    window.open('https://github.com/wztxy/MyCampusCard', '_blank');
  }
};

onMounted(() => {
  if ((window as any).electronAPI?.onLanguageChange) {
    (window as any).electronAPI.onLanguageChange((lang: string) => {
      locale.value = lang;
    });
  }
});

const handleLoginSuccess = (info: { stuNo: string; name: string; sessionId: string }) => {
  userInfo.value = {
    stuNo: info.stuNo,
    name: info.name,
    sessionId: info.sessionId
  };
  isLoggedIn.value = true;
};

const handleLogout = () => {
  try {
    localStorage.setItem('login_auto', 'false');
  } catch {
  }

  isLoggedIn.value = false;
  userInfo.value = {
    stuNo: '',
    name: '',
    sessionId: ''
  };
};

onMounted(() => {
  if (window.electronAPI?.onLogMessage) {
    window.electronAPI.onLogMessage((message: string) => {
      console.log(message);
    });
  }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: transparent;
  color: #1d1d1f;
}

/* Fallback for non-transparent window */
@supports not (backdrop-filter: blur(20px)) {
  body {
    background-color: #f5f5f7;
  }
}
</style>

<style scoped>
.main-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: rgba(245, 245, 247, 0.85);
}

.main-container.mac-glass {
  background-color: rgba(245, 245, 247, 0.35);
}

.title-bar {
  height: 32px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  -webkit-app-region: drag;
}

.title-bar-controls {
  position: absolute;
  right: 140px;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 201;
}

.no-drag {
  -webkit-app-region: no-drag;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #1d1d1f;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: all 0.2s;
}

.icon-btn:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.05);
}

.title-drag-region {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.app-title {
  font-size: 12px;
  font-weight: 500;
  color: #1d1d1f;
  opacity: 0.8;
}

.app-header {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  color: #1d1d1f;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 32px;
  z-index: 100;
  margin-top: 32px;
}

.app-header h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  font-size: 13px;
  color: #86868b;
  font-weight: 500;
}

.logout-btn {
  padding: 6px 12px;
  background: transparent;
  color: #007aff;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(0, 122, 255, 0.1);
}

.app-main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 24px;
  overflow-y: auto;
}

.app-footer {
  text-align: center;
  padding: 24px;
  color: #86868b;
  font-size: 12px;
}
</style>
