import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import { plantaApi } from '../../../services/api/plantas';
import InteractiveMap from '../../mapa/InteractiveMap';
import ErrorMessage from '../../common/ErrorMessage';



const schema = yup.object({
  nomePopular: yup.string().required('Nome popular é obrigatório').min(3, 'Mínimo 3 caracteres'),
  nomeCientifico: yup.string().optional().default(''),
  descricao: yup.string().required('Descrição é obrigatória').min(20, 'Mínimo 20 caracteres'),
  categoria: yup.array().of(yup.string()).min(1, 'Selecione pelo menos uma categoria').required(),
  comestivel: yup.boolean().default(false),
  medicinal: yup.boolean().default(false),
  nativa: yup.boolean().default(true),
  usos: yup.string().optional().default(''),
  cuidados: yup.string().optional().default(''),
  latitude: yup.number().required('Localização é obrigatória'),
  longitude: yup.number().required('Localização é obrigatória'),
  observacoes: yup.string().optional().default(''),
});

type PlantaFormData = yup.InferType<typeof schema>;

interface PlantaFormProps {
  initialPosition?: { lat: number; lng: number };
  onSuccess?: () => void;
}

const steps = ['Informações Básicas', 'Características', 'Localização', 'Revisão'];

const PlantaForm: React.FC<PlantaFormProps> = ({ initialPosition, onSuccess }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    initialPosition || null
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<PlantaFormData>({  // USAR PlantaFormData AQUI
    resolver: yupResolver(schema),
    defaultValues: {
      comestivel: false,
      medicinal: false,
      nativa: true,
      categoria: [],
      usos: '',
      cuidados: '',
      observacoes: '',
      nomePopular: '',
      descricao: '',
      latitude: 0,
      longitude: 0,
      nomeCientifico: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {  // FormData NATIVO AQUI
      return plantaApi.cadastrar(formData);
    },
    onSuccess: () => {
      onSuccess?.();
      navigate('/plantas');
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      setImages((prev) => [...prev, ...acceptedFiles.slice(0, 5 - prev.length)]);
    },
  });

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    setValue('latitude', lat, { shouldValidate: true });
    setValue('longitude', lng, { shouldValidate: true });
  };

  const handleNext = async () => {
    let isValid = false;
    
    switch (activeStep) {
      case 0:
        isValid = await trigger(['nomePopular', 'descricao']);
        break;
      case 1:
        isValid = await trigger(['categoria']);
        break;
      case 2:
        isValid = await trigger(['latitude', 'longitude']);
        break;
      default:
        isValid = true;
    }
    
    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = (data: PlantaFormData) => {  // USAR PlantaFormData AQUI
    const formData = new FormData();  // FormData NATIVO
    
    // Adicionar dados da planta
    const plantaData = {
      nomePopular: data.nomePopular,
      nomeCientifico: data.nomeCientifico || '',
      descricao: data.descricao,
      categoria: data.categoria,
      comestivel: data.comestivel,
      medicinal: data.medicinal,
      nativa: data.nativa,
      usos: data.usos || '',
      cuidados: data.cuidados || '',
      latitude: data.latitude,
      longitude: data.longitude,
      observacoes: data.observacoes || '',
    };
    
    formData.append('dados', JSON.stringify(plantaData));
    
    // Adicionar imagens
    images.forEach((image) => {
      formData.append('images', image);
    });
    
    mutation.mutate(formData);
  };

  const watchedValues = watch();

  // função auxiliar para renderizar Grid de forma compatível porque esse negócio não funciona de jeito nenhum :)
  const renderGridItem = (props: {
    children: React.ReactNode;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  }) => {
    const { children, xs, sm, md, lg, xl } = props;
    
    return (
      <Box
        sx={{
          width: '100%',
          flex: `0 0 ${(xs || 12) * (100/12)}%`,
          maxWidth: `${(xs || 12) * (100/12)}%`,
          px: 2,
          ...(sm && {
            '@media (min-width:600px)': {
              flex: `0 0 ${sm * (100/12)}%`,
              maxWidth: `${sm * (100/12)}%`,
            },
          }),
          ...(md && {
            '@media (min-width:900px)': {
              flex: `0 0 ${md * (100/12)}%`,
              maxWidth: `${md * (100/12)}%`,
            },
          }),
          ...(lg && {
            '@media (min-width:1200px)': {
              flex: `0 0 ${lg * (100/12)}%`,
              maxWidth: `${lg * (100/12)}%`,
            },
          }),
          ...(xl && {
            '@media (min-width:1536px)': {
              flex: `0 0 ${xl * (100/12)}%`,
              maxWidth: `${xl * (100/12)}%`,
            },
          }),
        }}
      >
        {children}
      </Box>
    );
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // informações básicas
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
            {renderGridItem({ children: (
              <Controller
                name="nomePopular"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nome Popular *"
                    fullWidth
                    error={!!errors.nomePopular}
                    helperText={errors.nomePopular?.message}
                  />
                )}
              />
            ), xs: 12, md: 6 })}
            
            {renderGridItem({ children: (
              <Controller
                name="nomeCientifico"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nome Científico"
                    fullWidth
                    helperText="Ex: Mangifera indica"
                  />
                )}
              />
            ), xs: 12, md: 6 })}
            
            {renderGridItem({ children: (
              <Controller
                name="descricao"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descrição *"
                    multiline
                    rows={4}
                    fullWidth
                    error={!!errors.descricao}
                    helperText={errors.descricao?.message}
                  />
                )}
              />
            ), xs: 12 })}
          </Box>
        );

      case 1: // características
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
            {renderGridItem({ children: (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Categorias *
                </Typography>
                <Controller
                  name="categoria"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.categoria}>
                      <Select
                        {...field}
                        multiple
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        <MenuItem value="COMESTIVEL">Comestível</MenuItem>
                        <MenuItem value="MEDICINAL">Medicinal</MenuItem>
                        <MenuItem value="NATIVA">Nativa</MenuItem>
                        <MenuItem value="EXOTICA">Exótica</MenuItem>
                        <MenuItem value="URBANA">Urbana</MenuItem>
                        <MenuItem value="ORNAMENTAL">Ornamental</MenuItem>
                      </Select>
                      <FormHelperText>{errors.categoria?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </>
            ), xs: 12 })}
            
            {renderGridItem({ children: (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Propriedades
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Controller
                    name="comestivel"
                    control={control}
                    render={({ field }) => (
                      <Chip
                        label="Comestível"
                        color={field.value ? 'success' : 'default'}
                        onClick={() => field.onChange(!field.value)}
                        variant={field.value ? 'filled' : 'outlined'}
                      />
                    )}
                  />
                  
                  <Controller
                    name="medicinal"
                    control={control}
                    render={({ field }) => (
                      <Chip
                        label="Medicinal"
                        color={field.value ? 'error' : 'default'}
                        onClick={() => field.onChange(!field.value)}
                        variant={field.value ? 'filled' : 'outlined'}
                      />
                    )}
                  />
                  
                  <Controller
                    name="nativa"
                    control={control}
                    render={({ field }) => (
                      <Chip
                        label={field.value ? 'Nativa' : 'Exótica'}
                        color={field.value ? 'primary' : 'warning'}
                        onClick={() => field.onChange(!field.value)}
                        variant={field.value ? 'filled' : 'outlined'}
                      />
                    )}
                  />
                </Box>
              </>
            ), xs: 12 })}
            
            {renderGridItem({ children: (
              <Controller
                name="usos"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Usos Comuns"
                    multiline
                    rows={3}
                    fullWidth
                    helperText="Ex: Frutos comestíveis, folhas para chá, madeira para construção"
                  />
                )}
              />
            ), xs: 12, md: 6 })}
            
            {renderGridItem({ children: (
              <Controller
                name="cuidados"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cuidados/Precauções"
                    multiline
                    rows={3}
                    fullWidth
                    helperText="Ex: Algumas pessoas podem ter alergia, frutos verdes são tóxicos"
                  />
                )}
              />
            ), xs: 12, md: 6 })}
          </Box>
        );

      case 2: // localização
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
            {renderGridItem({ children: (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Selecione a localização no mapa
                </Typography>
                {location ? (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Local selecionado: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </Alert>
                ) : (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Clique no mapa para selecionar a localização da planta
                  </Alert>
                )}
                
                <Box sx={{ height: 400, mb: 2 }}>
                  <InteractiveMap
                    editable
                    onLocationSelect={handleLocationSelect}
                    initialCenter={[-15.833625950102766, -48.056869816799846]} // Av Central, Taguatinga, Brasília-Df
                    initialZoom={13}
                  />
                </Box>
                
                {(errors.latitude || errors.longitude) && (
                  <Alert severity="error">
                    Por favor, selecione uma localização no mapa
                  </Alert>
                )}
              </>
            ), xs: 12 })}
            
            {renderGridItem({ children: (
              <Controller
                name="observacoes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Observações sobre a localização"
                    multiline
                    rows={3}
                    fullWidth
                    helperText="Ex: Planta está na calçada, próximo ao poste 12, acesso público"
                  />
                )}
              />
            ), xs: 12 })}
          </Box>
        );

      case 3: // revisão e imagens
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
            {renderGridItem({ children: (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Imagens (opcional, máximo 5)
                </Typography>
                <Box
                  {...getRootProps()}
                  sx={{
                    border: '2px dashed',
                    borderColor: 'grey.400',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <input {...getInputProps()} />
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
                  <Typography>
                    Arraste imagens aqui ou clique para selecionar
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Suporta JPEG, PNG, GIF (máx. 5MB cada)
                  </Typography>
                </Box>
                
                {/* Preview das imagens */}
                {images.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Imagens selecionadas ({images.length}/5):
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {images.map((image, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: 'relative',
                            width: 100,
                            height: 100,
                          }}
                        >
                          <Box
                            component="img"
                            src={URL.createObjectURL(image)}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'grey.200',
                            }}
                          />
                          <Button
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              minWidth: 'auto',
                              width: 24,
                              height: 24,
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.7)',
                              },
                            }}
                            onClick={() => removeImage(index)}
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            ), xs: 12 })}
            
            {renderGridItem({ children: (
              <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Resumo do Registro
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
                  <Box sx={{ width: '100%', px: 1, mb: 2, '@media (min-width:900px)': { width: '50%' } }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Nome Popular
                    </Typography>
                    <Typography>{watchedValues.nomePopular}</Typography>
                  </Box>
                  
                  {watchedValues.nomeCientifico && (
                    <Box sx={{ width: '100%', px: 1, mb: 2, '@media (min-width:900px)': { width: '50%' } }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Nome Científico
                      </Typography>
                      <Typography>{watchedValues.nomeCientifico}</Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ width: '100%', px: 1, mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Descrição
                    </Typography>
                    <Typography>{watchedValues.descricao}</Typography>
                  </Box>
                  
                  <Box sx={{ width: '100%', px: 1, mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Categorias
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {watchedValues.categoria?.map((cat) => (
                        <Chip key={cat} label={cat} size="small" />
                      ))}
                    </Box>
                  </Box>
                  
                  <Box sx={{ width: '100%', px: 1, mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Localização
                    </Typography>
                    <Typography>
                      {location ? 
                        `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : 
                        'Não selecionada'}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ), xs: 12 })}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/plantas')}
          sx={{ textTransform: 'none' }}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1">
          Registrar Nova Planta
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Box sx={{ mt: 2 }}>
                {renderStepContent(index)}
              </Box>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                {index > 0 && (
                  <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                    Voltar
                  </Button>
                )}
                {index < steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continuar
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSubmit(onSubmit)}
                    disabled={mutation.isPending}
                    startIcon={mutation.isPending && <CircularProgress size={20} />}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {mutation.isPending ? 'Salvando...' : 'Registrar Planta'}
                  </Button>
                )}
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {/* Erro na mutation */}
      {mutation.isError && (
        <Box sx={{ mt: 2 }}>
          <ErrorMessage
            title="Erro ao registrar planta"
            message={mutation.error instanceof Error ? mutation.error.message : 'Ocorreu um erro ao salvar a planta.'}
            onRetry={() => mutation.reset()}
            fullWidth
          />
        </Box>
      )}
    </Paper>
  );
};

export default PlantaForm;