CREATE TABLE Users (
    user_id INT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    created_at TIMESTAMP
);

CREATE TABLE Plans (
    plan_id INT PRIMARY KEY,
    user_id INT,
    plan_type VARCHAR(50), -- intervalPartitioning, intervalScheduling, minimizeLateness
    title VARCHAR(255),
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Tasks (
    task_id INT PRIMARY KEY,
    plan_id INT,
    activity VARCHAR(255),
    description TEXT,
    day_of_week VARCHAR(20), -- para intervalPartitioning e intervalScheduling
    start_time TIME,         -- para intervalPartitioning e intervalScheduling
    end_time TIME,           -- para intervalPartitioning e intervalScheduling
    difficulty INT,          -- para minimizeLateness
    days_until INT,          -- para minimizeLateness
    status VARCHAR(50),      -- 'pending', 'completed', 'in_progress'
    created_at TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES Plans(plan_id)
);

CREATE TABLE TaskResults (
    result_id INT PRIMARY KEY,
    task_id INT,
    lateness INT,           -- para minimizeLateness
    classroom_number INT,    -- para intervalPartitioning
    execution_order INT,     -- ordem de execução calculada
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id)
);

CREATE INDEX idx_plans_user ON Plans(user_id);
CREATE INDEX idx_tasks_plan ON Tasks(plan_id);
CREATE INDEX idx_tasks_status ON Tasks(status);
