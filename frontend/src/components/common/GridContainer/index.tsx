import React from 'react';
import { Box, type BoxProps } from '@mui/material';

interface GridContainerProps extends BoxProps {
  spacing?: number;
  children: React.ReactNode;
}

const GridContainer: React.FC<GridContainerProps> = ({
  children,
  spacing = 2,
  sx,
  ...props
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        margin: `-${spacing * 0.5}px`,
        width: `calc(100% + ${spacing}px)`,
        ...sx,
      }}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            sx: {
              padding: `${spacing * 0.5}px`,
              ...(child.props as any).sx,
            },
          });
        }
        return child;
      })}
    </Box>
  );
};

export default GridContainer;