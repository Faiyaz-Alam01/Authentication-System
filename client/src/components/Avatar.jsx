import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';

export default function UploadAvatars({avatar, onChange}) {
  const [avatarSrc, setAvatarSrc] = React.useState(avatar || "");

   React.useEffect(() => {
      if (avatar) {
        setAvatarSrc(avatar); // backend se aaya avatar set karo
      }
    }, [avatar]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setAvatarSrc(preview);
      onChange?.(file); 
    }
  };

  return (
    <ButtonBase
      component="label"
      role={undefined}
      tabIndex={-1} // prevent label from tab focus
      aria-label="Avatar image"
      sx={{
		
        borderRadius: '40px',
        '&:has(:focus-visible)': {
          outline: '2px solid',
          outlineOffset: '2px',
        },
      }}
    >
      <Avatar alt="Upload new avatar" sx={{ width: 80, height: 80 }} src={avatarSrc} />
      <input
        type="file"
        accept="image/*"
        style={{
          border: 0,
          clip: 'rect(0 0 0 0)',
          height: '1px',
          margin: '-1px',
          overflow: 'hidden',
          padding: 0,
          position: 'absolute',
          whiteSpace: 'nowrap',
          width: '1px',
        }}
        onChange={handleAvatarChange}
      />
    </ButtonBase>
  );
}
