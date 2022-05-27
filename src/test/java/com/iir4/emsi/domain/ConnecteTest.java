package com.iir4.emsi.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.iir4.emsi.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ConnecteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Connecte.class);
        Connecte connecte1 = new Connecte();
        connecte1.setId(1L);
        Connecte connecte2 = new Connecte();
        connecte2.setId(connecte1.getId());
        assertThat(connecte1).isEqualTo(connecte2);
        connecte2.setId(2L);
        assertThat(connecte1).isNotEqualTo(connecte2);
        connecte1.setId(null);
        assertThat(connecte1).isNotEqualTo(connecte2);
    }
}
