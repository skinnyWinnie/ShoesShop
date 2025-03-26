const container = document.querySelector('.slider-container');
const leftThumb = document.querySelector('.left-thumb');
const rightThumb = document.querySelector('.right-thumb');
const sliderRange = document.querySelector('.slider-range');
const minValue = document.getElementById('min-value');
const maxValue = document.getElementById('max-value');

const min = 1850;
const max = 25678;
let currentLeftValue = min;
let currentRightValue = max;

const formatter = new Intl.NumberFormat();

        function updateValues() {
            const containerRect = container.getBoundingClientRect();
            const leftPercent = (currentLeftValue - min) / (max - min);
            const rightPercent = (currentRightValue - min) / (max - min);

            // Обновление позиций элементов
            leftThumb.style.left = `${leftPercent * 100}%`;
            rightThumb.style.left = `${rightPercent * 100}%`;
            sliderRange.style.left = `${leftPercent * 100}%`;
            sliderRange.style.width = `${(rightPercent - leftPercent) * 100}%`;

            // Обновление инпутов
            minValue.value = formatter.format(currentLeftValue);
            maxValue.value = formatter.format(currentRightValue);
        }

        function handleInput(inputType) {
            return function(e) {
                let value = parseInt(e.target.value.replace(/\D/g, ''));
                
                if (isNaN(value)) return;
                
                value = Math.max(min, Math.min(max, value));
                
                if(inputType === 'min') {
                    if(value >= currentRightValue) value = currentRightValue - 1;
                    currentLeftValue = value;
                } else {
                    if(value <= currentLeftValue) value = currentLeftValue + 1;
                    currentRightValue = value;
                }
                
                updateValues();
            }
        }

        // Обработчики для инпутов
        minValue.addEventListener('input', handleInput('min'));
        maxValue.addEventListener('input', handleInput('max'));

function getValueFromPosition(clientX) {
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return Math.round((x / rect.width) * (max - min) + min);
}

function handleThumbMove(event, isLeft) {
    event.preventDefault();
    const move = (e) => {
        let newValue = getValueFromPosition(e.clientX);
        if(isLeft) {
            newValue = Math.min(newValue, currentRightValue - 1);
            currentLeftValue = newValue;
        } else {
            newValue = Math.max(newValue, currentLeftValue + 1);
            currentRightValue = newValue;
        }
        updateValues();
    };

    const stop = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', stop);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', stop);
}

leftThumb.addEventListener('mousedown', (e) => handleThumbMove(e, true));
rightThumb.addEventListener('mousedown', (e) => handleThumbMove(e, false));

function handleTrackClick(e) {
    // Проверяем, что клик был не по ползунку
    if (e.target.closest('.slider-thumb')) return;

    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickedValue = getValueFromPosition(e.clientX);
    
    // Определяем ближайший ползунок
    const leftDistance = Math.abs(clickedValue - currentLeftValue);
    const rightDistance = Math.abs(clickedValue - currentRightValue);
    
    // Выбираем какой ползунок двигать
    if (clickedValue < currentLeftValue || 
        (clickedValue < currentRightValue && leftDistance < rightDistance)) {
        currentLeftValue = Math.min(clickedValue, currentRightValue - 1);
    } else {
        currentRightValue = Math.max(clickedValue, currentLeftValue + 1);
    }
    
    updateValues();
}

// Добавляем обработчик клика на контейнер
container.addEventListener('click', handleTrackClick);

updateValues();



// btn-grid

document.querySelectorAll('.size-list__item').forEach(btn => {
    btn.addEventListener('click', function() {
      if(this.disabled) return;
      
      const wasActive = this.classList.contains('active');
      
      // Снимаем выделение со всех кнопок
      document.querySelectorAll('.size-list__item').forEach(b => 
        b.classList.remove('active'));
      
      // Если кнопка не была активна - выделяем её
      if(!wasActive) {
        this.classList.add('active');
      }
    });
  });