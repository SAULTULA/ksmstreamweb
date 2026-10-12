import React from 'react';
import {
  Users,
  Radio,
  Lock,
  PlaySquare,
  BarChart3,
  Repeat2,
  Server,
  Cpu
} from 'lucide-react';
import styles from './Features.module.css';

const featuresData = [
  {
    icon: Users,
    title: 'Oyentes Simultáneos Sin Límites',
    description: 'Transmite para 10, 1.000 o 50.000 oyentes sin restricciones de cupos ni cortes por saturación de tráfico.'
  },
  {
    icon: Radio,
    title: 'Calidad 128 kbps HD (MP3 / AAC+)',
    description: 'Sonido cristalino de alta fidelidad optimizado con códec AAC+ y MP3 para máxima compatibilidad y menor consumo de datos móvil.'
  },
  {
    icon: Lock,
    title: 'Streaming SSL Seguro (HTTPS)',
    description: 'Tu transmisión incluye enlace SSL nativo para funcionar sin bloqueos en navegadores modernos (Chrome, Firefox, Safari) y sitios seguros.'
  },
  {
    icon: PlaySquare,
    title: 'Reproductor HTML5 Multiplataforma',
    description: 'Compatible con PC, Mac, Android, iPhone, Smart TV y cualquier navegador sin requerir plugins externos.'
  },
  {
    icon: BarChart3,
    title: 'Estadísticas Gráficas en Tiempo Real',
    description: 'Métricas completas de audiencia, países de origen, picos horarios y tiempo promedio de escucha para tus anunciantes.'
  },
  {
    icon: Repeat2,
    title: 'Transferencia Mensual Ilimitada',
    description: 'Transmite las 24 horas del día, los 365 días del año sin preocuparte por límites de gigabytes o costos adicionales.'
  },
  {
    icon: Cpu,
    title: 'Panel de Control SonicPanel',
    description: 'El panel líder del mercado para administrar tu servidor, AutoDJ con música rotativa, listas de reproducción y geolocalización.'
  },
  {
    icon: Server,
    title: 'Servidores Icecast & Shoutcast',
    description: 'Arquitectura de alto rendimiento compatible con Icecast V2, Shoutcast V1, V2.5 y V2.6 para adaptarse a cualquier encoder.'
  }
];

export default function Features() {
  return (
    <section id="caracteristicas" className={styles.features}>
      <div className={styles['features__container']}>
        <div className={styles['features__header']}>
          <div className={styles['features__tag']}>Tecnología de Transmisión</div>
          <h2 className={styles['features__title']}>
            Todo lo que incluye tu servicio de <span className={styles['features__title-gradient']}>Streaming</span>
          </h2>
          <p className={styles['features__subtitle']}>
            Infraestructura de servidor de clase mundial pensada para emisoras comerciales, comunitarias y proyectos digitales.
          </p>
        </div>

        <div className={styles['features__grid']}>
          {featuresData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className={styles['features__card']}>
                <div className={styles['features__card-icon-box']}>
                  <IconComponent size={24} />
                </div>
                <h3 className={styles['features__card-title']}>{item.title}</h3>
                <p className={styles['features__card-desc']}>{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
