import { ChevronLeft, ChevronRight } from "lucide-react";

interface ScheduleCalendarProps {
  month: Date;
  scheduleData: Record<number, string>;
  dailyColleagues: Record<number, string[]>;
  wakeUpTimes: Record<number, string>;
  selectedDay: number | null;
  onSelectDay: (day: number | null) => void;
  getScheduleType: (code: string) => string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function ScheduleCalendar({
  month,
  scheduleData,
  dailyColleagues,
  wakeUpTimes,
  selectedDay,
  onSelectDay,
  getScheduleType,
  onPrevMonth,
  onNextMonth,
}: ScheduleCalendarProps) {
  const year = month.getFullYear();
  const monthNum = month.getMonth();
  const firstDay = new Date(year, monthNum, 1).getDay();
  const daysInMonth = new Date(year, monthNum + 1, 0).getDate();

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  const getScheduleColor = (code: string) => {
    const colorMap: Record<
      string,
      { bg: string; text: string; label: string }
    > = {
      주: { bg: "bg-blue-100", text: "text-blue-700", label: "주간" },
      야: { bg: "bg-purple-100", text: "text-purple-700", label: "야간" },
      비: { bg: "bg-amber-100", text: "text-amber-700", label: "비번" },
      휴: { bg: "bg-green-100", text: "text-green-700", label: "휴무" },
    };
    return (
      colorMap[code] || { bg: "bg-gray-100", text: "text-gray-700", label: "" }
    );
  };

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-3">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onPrevMonth}
          className="p-[] hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="이전 달"
        >
          <ChevronLeft size={20} className="text-slate-600" />
        </button>
        <h2 className="text-2xl font-bold text-slate-900">
          {year}년 {String(monthNum + 1).padStart(2, "0")}월
        </h2>
        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="다음 달"
        >
          <ChevronRight size={20} className="text-slate-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-slate-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const scheduleCode = scheduleData[day];
          const colors = scheduleCode ? getScheduleColor(scheduleCode) : {};
          const isSelected = selectedDay === day;
          const dayColleagues = dailyColleagues[day] || [];
          const dayWakeUpTime = wakeUpTimes[day];

          return (
            <button
              key={day}
              onClick={() => onSelectDay(isSelected ? null : day)}
              className={`aspect-square p-[2px] rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : scheduleCode
                  ? `${colors.bg} border-transparent hover:border-slate-300`
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="h-full flex flex-col items-center justify-center gap-[2px]">
                <div className="text-md font-bold text-slate-900">{day}</div>
                {scheduleCode && (
                  <div className={`text-xs font-semibold ${colors.text}`}>
                    {colors.label}
                  </div>
                )}
                {dayWakeUpTime && (
                  <div className="text-xs text-slate-500 font-medium">
                    🌅 {dayWakeUpTime}
                  </div>
                )}
                {dayColleagues.length > 0 && (
                  <div className="text-xs text-slate-600 truncate max-w-full">
                    {dayColleagues.join(", ")}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedDay && scheduleData[selectedDay] && (
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-3">
            {year}년 {String(monthNum + 1).padStart(2, "0")}월 {selectedDay}일
          </h3>

          <div className="space-y-2">
            <div>
              <p className="text-sm text-slate-600">근무 상태</p>
              <p
                className={`text-lg font-bold ${
                  getScheduleColor(scheduleData[selectedDay]).text
                }`}
              >
                {getScheduleType(scheduleData[selectedDay])}
              </p>
            </div>

            {wakeUpTimes[selectedDay] && (
              <div>
                <p className="text-sm text-slate-600">기상 시간</p>
                <p className="text-lg font-bold text-slate-900">
                  {wakeUpTimes[selectedDay]}
                </p>
              </div>
            )}

            {dailyColleagues[selectedDay] &&
              dailyColleagues[selectedDay].length > 0 && (
                <div>
                  <p className="text-sm text-slate-600 mb-2">
                    함께 일하는 사람
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {dailyColleagues[selectedDay].map((colleague, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {colleague}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
