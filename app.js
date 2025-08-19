// Application data
const appData = {
  user: {
    name: "Maria Silva",
    mode: "casa",
    level: 15,
    points: 2450,
    location: "São Paulo, SP"
  },
  casa_metrics: {
    wind_speed: "12 km/h",
    rain_collected: "45L",
    energy_today: "8.5 kWh",
    energy_total: "156 kWh",
    irrigation_status: "Próxima: 14:30",
    plants_sold: 23,
    water_saved: "340L"
  },
  fabrica_metrics: {
    smoke_captured: "89%",
    energy_generated: "245 kWh",
    co2_reduction: "1.2 ton",
    system_temp: "65°C",
    efficiency: "94%",
    cost_savings: "R$ 3.450"
  },
  marketplace_plants: [
    {name: "Manjericão", price: "R$ 8,50", seller: "João Local", rating: 4.8},
    {name: "Alecrim", price: "R$ 12,00", seller: "Horta Verde", rating: 4.9},
    {name: "Tomate Cereja", price: "R$ 15,00", seller: "Maria Jardins", rating: 4.7},
    {name: "Salsa", price: "R$ 6,00", seller: "Verde Vida", rating: 4.6},
    {name: "Cebolinha", price: "R$ 7,50", seller: "Horta Urbana", rating: 4.8},
    {name: "Rúcula", price: "R$ 9,00", seller: "Folhas Verdes", rating: 4.5}
  ],
  achievements: [
    {name: "Eco Warrior", description: "100 dias de irrigação automática", unlocked: true, icon: "🌱"},
    {name: "Plant Seller", description: "10 plantas vendidas", unlocked: true, icon: "🌿"},
    {name: "Water Saver", description: "500L de água economizada", unlocked: false, icon: "💧"},
    {name: "Energy Master", description: "100 kWh gerados", unlocked: true, icon: "⚡"},
    {name: "Green Thumb", description: "50 plantas cultivadas", unlocked: false, icon: "🌾"},
    {name: "Carbon Fighter", description: "1 tonelada de CO₂ reduzida", unlocked: false, icon: "🌍"}
  ]
};

// Current application state
let currentMode = 'casa';
let currentScreen = 'dashboard';
let isDarkMode = false;

// DOM elements
const modeToggleBtns = document.querySelectorAll('.toggle-btn');
const navTabs = document.querySelectorAll('.nav-tab');
const screens = document.querySelectorAll('.screen');
const modeContents = document.querySelectorAll('.mode-content');
const marketplaceNavTab = document.querySelector('.nav-tab[data-screen="marketplace"]');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  bindEvents();
  updateUIWithData();
  setInterval(updateRealTimeData, 30000); // Update every 30 seconds
});

function initializeApp() {
  // Set initial mode
  setMode(currentMode);
  
  // Set initial screen
  setScreen(currentScreen);
  
  // Update user info
  document.getElementById('user-name').textContent = appData.user.name;
  document.getElementById('user-location').textContent = appData.user.location;
  document.getElementById('profile-name').textContent = appData.user.name;
  document.getElementById('user-level').textContent = appData.user.level;
  document.getElementById('sustainability-score').textContent = appData.user.points;
  
  // Populate marketplace
  populateMarketplace();
  
  // Populate achievements
  populateAchievements();
  
  // Show welcome notification
  setTimeout(() => {
    showNotification('Bem-vindo ao EcoGiro!', '🌱');
  }, 1000);
}

function bindEvents() {
  // Mode toggle buttons
  modeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      setMode(mode);
    });
  });
  
  // Navigation tabs
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const screen = tab.dataset.screen;
      setScreen(screen);
    });
  });
  
  // Quick action buttons
  document.querySelectorAll('.quick-action-btn').forEach(btn => {
    btn.addEventListener('click', handleQuickAction);
  });
  
  // Irrigation toggle
  document.querySelectorAll('.toggle-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.toggle-option').forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      
      const mode = option.textContent.trim();
      showNotification(`Irrigação alterada para ${mode.toLowerCase()}`, '🌱');
    });
  });
  
  // Equipment cards (for industrial mode)
  document.querySelectorAll('.equipment-card').forEach(card => {
    card.addEventListener('click', () => {
      showNotification('Detalhes do equipamento carregados', '⚙️');
    });
  });
  
  // Plant buy buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-buy')) {
      const plantName = e.target.closest('.plant-card').querySelector('.plant-name').textContent;
      showNotification(`${plantName} adicionado ao carrinho`, '🛒');
    }
    
    if (e.target.classList.contains('btn-favorite')) {
      const plantName = e.target.closest('.plant-card').querySelector('.plant-name').textContent;
      e.target.textContent = e.target.textContent === '♡' ? '❤️' : '♡';
      showNotification(`${plantName} ${e.target.textContent === '❤️' ? 'adicionado aos' : 'removido dos'} favoritos`, '❤️');
    }
  });
  
  // Settings toggles
  document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
    isDarkMode = e.target.checked;
    document.body.classList.toggle('dark-mode', isDarkMode);
    showNotification(`Tema ${isDarkMode ? 'escuro' : 'claro'} ativado`, '🌙');
  });
  
  document.getElementById('notifications-toggle').addEventListener('change', (e) => {
    const enabled = e.target.checked;
    showNotification(`Notificações ${enabled ? 'ativadas' : 'desativadas'}`, '🔔');
  });
  
  // Search functionality
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      filterPlants(searchTerm);
    });
  }
  
  // Filter functionality
  const filterSelect = document.querySelector('.filter-select');
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      const category = e.target.value;
      filterPlantsByCategory(category);
    });
  }
  
  // Report generation buttons
  document.querySelectorAll('.btn').forEach(btn => {
    if (btn.textContent.includes('Gerar Relatório')) {
      btn.addEventListener('click', () => {
        showNotification('Relatório sendo gerado...', '📊');
        setTimeout(() => {
          showNotification('Relatório gerado com sucesso!', '✅');
        }, 2000);
      });
    }
  });
}

function setMode(mode) {
  currentMode = mode;
  
  // Update mode toggle buttons
  modeToggleBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  
  // Update mode content visibility
  modeContents.forEach(content => {
    content.classList.toggle('active', content.classList.contains(`${mode}-mode`));
  });
  
  // Update navigation label for marketplace/certificates
  if (mode === 'casa') {
    marketplaceNavTab.querySelector('.nav-label').textContent = 'Marketplace';
    marketplaceNavTab.querySelector('.nav-icon').textContent = '🛒';
  } else {
    marketplaceNavTab.querySelector('.nav-label').textContent = 'Certificados';
    marketplaceNavTab.querySelector('.nav-icon').textContent = '📜';
  }
  
  // Update metrics
  updateMetrics();
}

function setScreen(screen) {
  currentScreen = screen;
  
  // Update screen visibility
  screens.forEach(scr => {
    scr.classList.toggle('active', scr.id === `${screen}-screen`);
  });
  
  // Update navigation tabs
  navTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.screen === screen);
  });
}

function updateUIWithData() {
  updateMetrics();
  updateStats();
}

function updateMetrics() {
  if (currentMode === 'casa') {
    // Casa metrics
    document.getElementById('wind-speed').textContent = appData.casa_metrics.wind_speed;
    document.getElementById('rain-collected').textContent = appData.casa_metrics.rain_collected;
    document.getElementById('energy-today').textContent = appData.casa_metrics.energy_today;
    document.getElementById('energy-total').textContent = appData.casa_metrics.energy_total;
    document.getElementById('irrigation-status').textContent = appData.casa_metrics.irrigation_status;
  } else {
    // Fábrica metrics
    document.getElementById('smoke-captured').textContent = appData.fabrica_metrics.smoke_captured;
    document.getElementById('energy-generated').textContent = appData.fabrica_metrics.energy_generated;
    document.getElementById('co2-reduction').textContent = appData.fabrica_metrics.co2_reduction;
    document.getElementById('system-temp').textContent = appData.fabrica_metrics.system_temp;
    document.getElementById('efficiency').textContent = appData.fabrica_metrics.efficiency;
    document.getElementById('cost-savings').textContent = appData.fabrica_metrics.cost_savings;
  }
}

function updateStats() {
  document.getElementById('plants-sold').textContent = appData.casa_metrics.plants_sold;
  document.getElementById('water-saved').textContent = appData.casa_metrics.water_saved;
  document.getElementById('energy-generated-stat').textContent = appData.casa_metrics.energy_total;
}

function populateMarketplace() {
  const plantsGrid = document.getElementById('plants-grid');
  if (!plantsGrid) return;
  
  plantsGrid.innerHTML = '';
  
  appData.marketplace_plants.forEach(plant => {
    const plantCard = createPlantCard(plant);
    plantsGrid.appendChild(plantCard);
  });
}

function createPlantCard(plant) {
  const card = document.createElement('div');
  card.className = 'plant-card';
  
  const stars = '★'.repeat(Math.floor(plant.rating)) + '☆'.repeat(5 - Math.floor(plant.rating));
  
  card.innerHTML = `
    <div class="plant-header">
      <h4 class="plant-name">${plant.name}</h4>
      <span class="plant-price">${plant.price}</span>
    </div>
    <div class="plant-seller">Por ${plant.seller}</div>
    <div class="plant-rating">
      <span class="rating-stars">${stars}</span>
      <span class="rating-value">${plant.rating}</span>
    </div>
    <div class="plant-actions">
      <button class="btn-buy">Comprar</button>
      <button class="btn-favorite">♡</button>
    </div>
  `;
  
  return card;
}

function populateAchievements() {
  const achievementsGrid = document.getElementById('achievements-grid');
  if (!achievementsGrid) return;
  
  achievementsGrid.innerHTML = '';
  
  appData.achievements.forEach(achievement => {
    const achievementCard = createAchievementCard(achievement);
    achievementsGrid.appendChild(achievementCard);
  });
}

function createAchievementCard(achievement) {
  const card = document.createElement('div');
  card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : ''}`;
  
  card.innerHTML = `
    <div class="achievement-icon">${achievement.icon}</div>
    <div class="achievement-info">
      <h5>${achievement.name}</h5>
      <p class="achievement-description">${achievement.description}</p>
    </div>
  `;
  
  return card;
}

function filterPlants(searchTerm) {
  const plantCards = document.querySelectorAll('.plant-card');
  
  plantCards.forEach(card => {
    const plantName = card.querySelector('.plant-name').textContent.toLowerCase();
    const plantSeller = card.querySelector('.plant-seller').textContent.toLowerCase();
    
    const matches = plantName.includes(searchTerm) || plantSeller.includes(searchTerm);
    card.style.display = matches ? 'block' : 'none';
  });
}

function filterPlantsByCategory(category) {
  const plantCards = document.querySelectorAll('.plant-card');
  
  if (category === 'Todas as categorias') {
    plantCards.forEach(card => {
      card.style.display = 'block';
    });
    return;
  }
  
  // Simple category filtering based on plant names
  const categoryMappings = {
    'Temperos': ['manjericão', 'alecrim', 'salsa', 'cebolinha'],
    'Hortaliças': ['tomate', 'rúcula', 'alface', 'couve'],
    'Flores': ['rosa', 'margarida', 'violeta', 'girassol']
  };
  
  plantCards.forEach(card => {
    const plantName = card.querySelector('.plant-name').textContent.toLowerCase();
    const categoryPlants = categoryMappings[category] || [];
    
    const matches = categoryPlants.some(plant => plantName.includes(plant));
    card.style.display = matches ? 'block' : 'none';
  });
}

function handleQuickAction(e) {
  const buttonText = e.target.textContent.trim();
  
  if (buttonText === 'Irrigar Agora') {
    showNotification('Irrigação iniciada manualmente', '💧');
    
    // Update irrigation status
    setTimeout(() => {
      document.getElementById('irrigation-status').textContent = 'Em andamento...';
    }, 500);
    
    setTimeout(() => {
      document.getElementById('irrigation-status').textContent = 'Próxima: 18:00';
      showNotification('Irrigação concluída', '✅');
    }, 3000);
  }
}

function updateRealTimeData() {
  // Simulate real-time data updates
  if (currentMode === 'casa') {
    // Update wind speed
    const windSpeed = Math.floor(Math.random() * 10) + 8;
    document.getElementById('wind-speed').textContent = `${windSpeed} km/h`;
    
    // Update energy today
    const energyToday = (Math.random() * 5 + 5).toFixed(1);
    document.getElementById('energy-today').textContent = `${energyToday} kWh`;
    
    // Update progress bar
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
      const progress = Math.random() * 40 + 40;
      progressBar.style.width = `${progress}%`;
    }
  } else {
    // Update factory metrics
    const smokeCapture = Math.floor(Math.random() * 10) + 85;
    document.getElementById('smoke-captured').textContent = `${smokeCapture}%`;
    
    const energyGenerated = Math.floor(Math.random() * 50) + 220;
    document.getElementById('energy-generated').textContent = `${energyGenerated} kWh`;
    
    const efficiency = Math.floor(Math.random() * 8) + 90;
    document.getElementById('efficiency').textContent = `${efficiency}%`;
  }
}

function showNotification(message, icon = '🔔') {
  const toast = document.getElementById('notification-toast');
  const toastMessage = toast.querySelector('.toast-message');
  const toastIcon = toast.querySelector('.toast-icon');
  
  toastMessage.textContent = message;
  toastIcon.textContent = icon;
  
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Smart notifications system
function initializeSmartNotifications() {
  const notifications = [
    {
      condition: () => currentMode === 'casa' && Math.random() > 0.9,
      message: 'Previsão de chuva em 2 horas',
      icon: '🌧️',
      interval: 60000
    },
    {
      condition: () => currentMode === 'casa' && Math.random() > 0.95,
      message: 'Nova planta disponível no marketplace',
      icon: '🌱',
      interval: 120000
    },
    {
      condition: () => currentMode === 'fabrica' && Math.random() > 0.9,
      message: 'Manutenção preventiva recomendada',
      icon: '🔧',
      interval: 180000
    },
    {
      condition: () => Math.random() > 0.8,
      message: 'Parabéns! Novo nível de sustentabilidade alcançado',
      icon: '🏆',
      interval: 300000
    }
  ];
  
  notifications.forEach(notification => {
    setInterval(() => {
      if (notification.condition()) {
        showNotification(notification.message, notification.icon);
      }
    }, notification.interval);
  });
}

// Initialize smart notifications
setTimeout(initializeSmartNotifications, 5000);

// Simulate some dynamic behaviors
setTimeout(() => {
  // Simulate a plant sale
  if (currentMode === 'casa') {
    appData.casa_metrics.plants_sold++;
    document.getElementById('plants-sold').textContent = appData.casa_metrics.plants_sold;
    showNotification('Parabéns! Você vendeu uma planta', '🎉');
  }
}, 15000);

// Weather API simulation
function simulateWeatherUpdate() {
  const weatherConditions = ['☀️', '⛅', '🌧️', '🌤️', '⛈️'];
  const currentWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
  
  // This would normally fetch from a real weather API
  showNotification(`Condição climática: ${currentWeather}`, currentWeather);
}

// Simulate weather updates
setInterval(simulateWeatherUpdate, 300000); // Every 5 minutes

// PWA-like features
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // In a real app, you would register a service worker here
    console.log('App ready for PWA features');
  });
}

// Accessibility features
document.addEventListener('keydown', (e) => {
  // Allow keyboard navigation
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-navigation');
});

// Touch gestures for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  
  // Swipe detection
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
    if (deltaX > 0) {
      // Swipe right - could navigate to previous tab
      console.log('Swiped right');
    } else {
      // Swipe left - could navigate to next tab
      console.log('Swiped left');
    }
  }
});

// Pull to refresh simulation
let pullToRefreshThreshold = 80;
let pullDistance = 0;
let isPulling = false;

document.addEventListener('touchstart', (e) => {
  if (window.scrollY === 0) {
    pullDistance = 0;
    isPulling = true;
  }
});

document.addEventListener('touchmove', (e) => {
  if (isPulling && window.scrollY === 0) {
    pullDistance = e.touches[0].clientY - touchStartY;
    
    if (pullDistance > pullToRefreshThreshold) {
      // Visual feedback for pull to refresh
      document.body.style.transform = `translateY(${Math.min(pullDistance - pullToRefreshThreshold, 30)}px)`;
    }
  }
});

document.addEventListener('touchend', (e) => {
  if (isPulling) {
    document.body.style.transform = '';
    
    if (pullDistance > pullToRefreshThreshold) {
      showNotification('Dados atualizados', '🔄');
      updateRealTimeData();
    }
    
    isPulling = false;
    pullDistance = 0;
  }
});

// Error handling
window.addEventListener('error', (e) => {
  console.error('App error:', e.error);
  showNotification('Ocorreu um erro. Tentando novamente...', '⚠️');
});

// Performance monitoring
const observePerformance = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0];
    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
    
    console.log(`App loaded in ${loadTime}ms`);
    
    if (loadTime > 3000) {
      console.warn('App is loading slowly');
    }
  }
};

window.addEventListener('load', observePerformance);

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setMode,
    setScreen,
    showNotification,
    updateMetrics,
    appData
  };
}