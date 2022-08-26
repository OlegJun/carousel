// Получаем элементы
const slider = document.querySelector('.slider');
const sliderTrack = slider.querySelector('.slider-track');
const slides = slider.querySelectorAll('.slide');
const nextButton = document.querySelector('.next');
const previosButton = document.querySelector('.prev');

// Переменная фдля получения полной ширины обьекта
const slideWidth = slides[0].offsetWidth;

// Находим максимальное количество пролистывания, чтобы не перелистывать эдемент больше
const maxSwap = slideWidth * 0.7

// Массив содеращий в себе все скорости перемещения
let speedMassive = []

// Создаем переменную для отслеживания индекса, по которому мы будем вычислять translate3d и переключать слайд
let index = 0;

// В глобальной области видимости создаем переменную начала касания, чтобы определить, сколько мы прошли за один flipp поэкрану
let startTouch = 0;

// Скорость перемещения
let speed = 0;

// Значение из которого мы будем брать скорость
let value = 0;

// Функция опционально принимает значение индекса умноженного на ширину обьекта
const functionFlippslide = (translate3dsize = -slideWidth * index) => {
   // С помощью forEach сдвигаем все элементы с классом slide на заданное количество пикселей
   slides.forEach(el => {
      el.style.transform = `translate3d(${translate3dsize}px, 0px, 0px)`
   })
}

// Функция переключения на следующий слайд
const nextSlide = () => {
   // Проверяем индекс если он больше чем длина массива слайдов - 1, тогда приравниваем его к нулю, и вызываем функцию смещения слайдов
   if(index < slides.length - 1) {
      index++
   } else {
      index= 0
   }
   functionFlippslide()
}

// Функция переключения на предидущий слайд
const previoSlide = () => {
   // Проверяем индекс если он больше 0, тогда отнимаем единицу для переключения на предидущий слайд
   if(index > 0) {
      index--
   } else {
      index = slides.length - 1
   }
   functionFlippslide()
}

// Функция для работы с touchscreen для переключения слайдов
const nextSlideTouch = (event) => {
// Проверяем событие поступившее в функцию если оно было началом клика, тогда в startTouch принимаем позицию клика
   if(event.type == 'touchstart') {
      startTouch = (event.targetTouches[0].clientX);
      value = startTouch
   } else {
// Если событие touchmove то есть передвижение на touchscreen то тогда присваеваем переменной позицию разницы с учетом индекса
      let difference = (event.targetTouches[0].clientX - startTouch) / (index + 1);
// Проверяем если разница между тапом и начальной позицией больше 
      if(difference <= maxSwap && difference >= -maxSwap) {
         functionFlippslide((-slideWidth * index) + difference)
      }
// Расчитываем скорость от старта до следущего события свайпа
      speed = (value - event.targetTouches[0].clientX)
// Пушим скорость в массив скоростей
      speedMassive.push(speed)
// Обновляем предыдущую позицию
      value = event.targetTouches[0].clientX
   }
}

const touchEnd = () => {
// Ищем самую большую и самую маленькую скорость движения и проверяем если они были больше или меньшу порога, то прокручиваем слайд
   const maxSpeed = Math.max(...speedMassive)
   const minSpeed = Math.min(...speedMassive)
   if(maxSpeed >= 40) {
      nextSlide()
   }
   if(minSpeed <= -40) {
      previoSlide()
   }
   functionFlippslide()
// Очищаем массив
   speedMassive = []
}


// Отслеживаем нажатие на кнопку и переключаем слайд на следующий
nextButton.addEventListener('click', nextSlide)

// Отслеживаем нажатие на кнопку и переключаем слайд на предидущий
previosButton.addEventListener('click', previoSlide)

// Отслеживаем нажатие на touchpad и переключаем слайд на следующий
sliderTrack.addEventListener('touchstart', nextSlideTouch)

// Отслеживаем все перемещения над touchpad
sliderTrack.addEventListener('touchmove', nextSlideTouch)

// Отслеживаем отрыв пальца от экрана и в зависимости от того на сколько пользователь его переместил переключаем слайд
sliderTrack.addEventListener('touchend', touchEnd)