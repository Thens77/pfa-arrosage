package com.iir4.emsi.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.iir4.emsi.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EspaceVertTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EspaceVert.class);
        EspaceVert espaceVert1 = new EspaceVert();
        espaceVert1.setId(1L);
        EspaceVert espaceVert2 = new EspaceVert();
        espaceVert2.setId(espaceVert1.getId());
        assertThat(espaceVert1).isEqualTo(espaceVert2);
        espaceVert2.setId(2L);
        assertThat(espaceVert1).isNotEqualTo(espaceVert2);
        espaceVert1.setId(null);
        assertThat(espaceVert1).isNotEqualTo(espaceVert2);
    }
}
