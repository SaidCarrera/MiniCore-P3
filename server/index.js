const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection with error handling
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/expense-manager', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Models
const Employee = mongoose.model('Employee', {
  name: { 
    type: String,
    required: true
  }
});

const Department = mongoose.model('Department', {
  name: {
    type: String,
    required: true
  }
});

const Expense = mongoose.model('Expense', {
  date: Date,
  description: String,
  amount: Number,
  employeeId: mongoose.Schema.Types.ObjectId,
  departmentId: mongoose.Schema.Types.ObjectId
});

// Routes
// Employees
app.get('/api/employees', async (req, res, next) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    next(err);
  }
});

app.post('/api/employees', async (req, res, next) => {
  try {
    const employee = new Employee(req.body);
    const savedEmployee = await employee.save();
    res.status(201).json(savedEmployee);
  } catch (err) {
    next(err);
  }
});

// Departments
app.get('/api/departments', async (req, res, next) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    next(err);
  }
});

app.post('/api/departments', async (req, res, next) => {
  try {
    const department = new Department(req.body);
    const savedDepartment = await department.save();
    res.status(201).json(savedDepartment);
  } catch (err) {
    next(err);
  }
});

// Expenses
app.get('/api/expenses', async (req, res, next) => {
  try {
    const expenses = await Expense.find()
      .populate('employeeId')
      .populate('departmentId');
    res.json(expenses);
  } catch (err) {
    next(err);
  }
});

app.post('/api/expenses', async (req, res, next) => {
  try {
    const expense = new Expense(req.body);
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    next(err);
  }
});

app.get('/api/expenses/department/:departmentId', async (req, res, next) => {
  try {
    const expenses = await Expense.find({ departmentId: req.params.departmentId });
    res.json(expenses);
  } catch (err) {
    next(err);
  }
});

app.get('/api/expenses/date-range', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const expenses = await Expense.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });
    res.json(expenses);
  } catch (err) {
    next(err);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));