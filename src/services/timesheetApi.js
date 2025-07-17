const MOCK_TIMESHEETS = [
  {
    id: 1,
    week: 1,
    date: "1 - 5 January, 2024",
    status: "completed",
    hoursLogged: 40
  },
  {
    id: 2,
    week: 2,
    date: "8 - 12 January, 2024",
    status: "completed",
    hoursLogged: 42
  },
  {
    id: 3,
    week: 3,
    date: "15 - 19 January, 2024",
    status: "incomplete",
    hoursLogged: 32
  },
  {
    id: 4,
    week: 4,
    date: "22 - 26 January, 2024",
    status: "completed",
    hoursLogged: 40
  },
  {
    id: 5,
    week: 5,
    date: "28 January - 1 February, 2024",
    status: "missing",
    hoursLogged: 0
  }
];

let MOCK_TASKS_BY_WEEK = {
  1: {
    'mon-1': [
      { id: 1, description: 'A', hours: 4, date: '2024-01-01' },
      { id: 2, description: 'B', hours: 4, date: '2024-01-01' }
    ],
    'tue-2': [
      { id: 3, description: 'C', hours: 8, date: '2024-01-02' }
    ],
    'wed-3': [
      { id: 4, description: 'D', hours: 8, date: '2024-01-03' }
    ],
    'thu-4': [
      { id: 5, description: 'E', hours: 8, date: '2024-01-04' }
    ],
    'fri-5': [
      { id: 6, description: 'F', hours: 8, date: '2024-01-05' }
    ]
  },
  2: {
    'mon-8': [
      { id: 7, description: 'A', hours: 8, date: '2024-01-08' }
    ],
    'tue-9': [
      { id: 8, description: 'B', hours: 6, date: '2024-01-09' }
    ],
    'wed-10': [
      { id: 9, description: 'C', hours: 2, date: '2024-01-10' },
      { id: 10, description: 'D', hours: 6, date: '2024-01-10' }
    ],
    'thu-11': [
      { id: 11, description: 'E', hours: 8, date: '2024-01-11' }
    ],
    'fri-12': [
      { id: 12, description: 'F', hours: 8, date: '2024-01-12' }
    ]
  },
  3: {
    'mon-15': [
      { id: 13, description: 'A', hours: 4, date: '2024-01-15' }
    ],
    'tue-16': [
      { id: 14, description: 'B', hours: 6, date: '2024-01-16' }
    ],
    'wed-17': [
      { id: 15, description: 'C', hours: 8, date: '2024-01-17' }
    ],
    'thu-18': [
      { id: 16, description: 'D', hours: 4, date: '2024-01-18' }
    ],
    'fri-19': [
      { id: 17, description: 'E', hours: 6, date: '2024-01-19' }
    ]
  },
  4: {
    'mon-22': [
      { id: 18, description: 'A', hours: 8, date: '2024-01-22' }
    ],
    'tue-23': [
      { id: 19, description: 'B', hours: 8, date: '2024-01-23' }
    ],
    'wed-24': [
      { id: 20, description: 'C', hours: 8, date: '2024-01-24' }
    ],
    'thu-25': [
      { id: 21, description: 'D', hours: 8, date: '2024-01-25' }
    ],
    'fri-26': [
      { id: 22, description: 'E', hours: 8, date: '2024-01-26' }
    ]
  },
  5: {} 
};

const generateDateRange = (weekNumber) => {
  const baseDate = new Date(2024, 0, 1);
  const startDate = new Date(baseDate.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000);
  const endDate = new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1000);
  
  const startStr = startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
  const endStr = endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  
  return `${startStr} - ${endStr}`;
};

const calculateHoursForWeek = (weekNumber) => {
  const weekTasks = MOCK_TASKS_BY_WEEK[weekNumber] || {};
  return Object.values(weekTasks)
    .flat()
    .reduce((total, task) => total + (parseFloat(task.hours) || 0), 0);
};

const getStatusFromHours = (hours) => {
  if (hours >= 40) return 'completed';
  if (hours > 0) return 'incomplete';
  return 'missing';
};

export const timesheetApi = {
  async getTimesheets() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const updatedTimesheets = MOCK_TIMESHEETS.map(ts => {
      const hours = calculateHoursForWeek(ts.week);
      return {
        ...ts,
        hoursLogged: hours,
        status: getStatusFromHours(hours),
        date: generateDateRange(ts.week)
      };
    });
    
    return {
      success: true,
      timesheets: updatedTimesheets
    };
  },

  async getTimesheet(week) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const weekNumber = parseInt(week);
    let timesheet = MOCK_TIMESHEETS.find(ts => ts.week === weekNumber);
    
    if (!timesheet) {
      timesheet = {
        id: MOCK_TIMESHEETS.length + 1,
        week: weekNumber,
        date: generateDateRange(weekNumber),
        status: 'missing',
        hoursLogged: 0
      };
      MOCK_TIMESHEETS.push(timesheet);
    }
    
    const hours = calculateHoursForWeek(weekNumber);
    timesheet.hoursLogged = hours;
    timesheet.status = getStatusFromHours(hours);
    timesheet.date = generateDateRange(weekNumber);
    
    return {
      success: true,
      timesheet,
      tasks: MOCK_TASKS_BY_WEEK[weekNumber] || {}
    };
  },

  async saveTasks(week, tasks) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const weekNumber = parseInt(week);
    MOCK_TASKS_BY_WEEK[weekNumber] = tasks;
    
    const timesheet = MOCK_TIMESHEETS.find(ts => ts.week === weekNumber);
    if (timesheet) {
      const hours = calculateHoursForWeek(weekNumber);
      timesheet.hoursLogged = hours;
      timesheet.status = getStatusFromHours(hours);
    }
    
    return {
      success: true,
      message: "Tasks saved successfully"
    };
  },

  async createTimesheet(week) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const weekNumber = parseInt(week);
    const newTimesheet = {
      id: MOCK_TIMESHEETS.length + 1,
      week: weekNumber,
      date: generateDateRange(weekNumber),
      status: 'missing',
      hoursLogged: 0
    };
    
    MOCK_TIMESHEETS.push(newTimesheet);
    MOCK_TASKS_BY_WEEK[weekNumber] = {};
    
    return {
      success: true,
      timesheet: newTimesheet
    };
  }
};
