import React from 'react';
import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  severity?: 'error' | 'warning' | 'info' | 'success';
  fullWidth?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Erro',
  message,
  onRetry,
  severity = 'error',
  fullWidth = false,
}) => {
  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <Alert
        severity={severity}
        action={
          onRetry && (
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
            >
              Tentar novamente
            </Button>
          )
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;