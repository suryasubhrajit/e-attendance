export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">KMBB College of Engineering and Technology</h3>
            <p className="text-sm text-gray-300">E-Attendance Management System</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-300">
              © 2024 KMBB CET. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Khordha, Odisha • Affiliated by BPUT
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}