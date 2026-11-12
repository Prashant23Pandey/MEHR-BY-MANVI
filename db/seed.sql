-- Optional demo rows for local development. Run with: npm run db:seed
INSERT INTO applications (name, email, grow, source, status)
VALUES
  (
    'Demo Partner',
    'demo@example.com',
    'We sell a booking platform for independent studios and want to grow organic sign-ups in the UK and Norway.',
    'seed',
    'demo'
  ),
  (
    'Second Demo',
    'second.demo@example.com',
    'A direct-to-consumer furniture store looking for organic revenue growth beyond our current baseline.',
    'seed',
    'demo'
  );
