// src/components/common/FlexGrid.tsx
import React from 'react';
import { Box, type BoxProps } from '@mui/material';

export interface FlexGridItemProps extends BoxProps {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export const GridItem: React.FC<FlexGridItemProps> = ({
  children,
  xs = 12,
  sm,
  md,
  lg,
  xl,
  sx,
  ...props
}) => {
  const getWidth = (size?: number) => size ? `${(size / 12) * 100}%` : '100%';

  return (
    <Box
      sx={{
        width: '100%',
        flex: `0 0 ${getWidth(xs)}`,
        maxWidth: getWidth(xs),
        ...(sm && {
          '@media (min-width:600px)': {
            flex: `0 0 ${getWidth(sm)}`,
            maxWidth: getWidth(sm),
          },
        }),
        ...(md && {
          '@media (min-width:900px)': {
            flex: `0 0 ${getWidth(md)}`,
            maxWidth: getWidth(md),
          },
        }),
        ...(lg && {
          '@media (min-width:1200px)': {
            flex: `0 0 ${getWidth(lg)}`,
            maxWidth: getWidth(lg),
          },
        }),
        ...(xl && {
          '@media (min-width:1536px)': {
            flex: `0 0 ${getWidth(xl)}`,
            maxWidth: getWidth(xl),
          },
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default GridItem;