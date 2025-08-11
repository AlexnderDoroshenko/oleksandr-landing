export default function About() {
    return (
      <div className="min-h-screen p-6 text-white bg-gray-900">
        <h1 className="mb-4 text-3xl font-bold">Про мене</h1>
        <img src="/oleksandr-landing/images/avatar.png" alt="Oleksandr" className="mb-4 border-4 border-white rounded-full w-160 h-160" />
        <p className="mb-2">
          Моє ім'я Олександр, я AQA Engineer з понад 6 роками досвіду у тестуванні.
          Працював у Capgemini, Nayax Retail, UPITec.
          Допомагав впроваджувати процес тестування з нуля на усіх рівнях.
          Основний стек: Python, Pytest, Playwright, Selenium, Requests.
          Впроваджували пайплайни для CI, Jenkins.
          Маю досвід менторства, командної роботи та технічних інтерв’ю.
          Наразі переважно займаюся підтримкою фреймворку на Behave.
          Приймаю участь у волонтерськіх проектах, менторю початківців.
        </p>
        <p className="mb-2">
          Також я наразі навчаюся на магістратурі на напрямку кібербезпека.
        </p>
        <p>
          Прагну поєднувати автоматизацію тестування з сучасними підходами до безпеки програмного забезпечення.
        </p>
      </div>
    )
  }
